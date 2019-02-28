package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;


public class TodoControllerSpec {
  private TodoController todoController;
  private ObjectId todoId;
  private Map<String, String[]> queryParams;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testDocs = new ArrayList<>();
    testDocs.add(Document.parse("{\n" +
      "                    owner: \"KK\",\n" +
      "                    status: true,\n" +
      "                    body: \"Schedule donut walk\",\n" +
      "                    category: \"software design\"\n" +
      "                }"));
    testDocs.add(Document.parse("{\n" +
      "                    owner: \"Nic\",\n" +
      "                    status: \"false\",\n" +
      "                    body: \"Grade Labs\",\n" +
      "                    category: \"databases\"\n" +
      "                }"));
    testDocs.add(Document.parse("{\n" +
      "                    owner: \"Jackson\",\n" +
      "                    status: \"false\",\n" +
      "                    body: \"Do Lab 3\",\n" +
      "                    category: \"software design\"\n" +
      "                }"));

    todoId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", todoId);
    sam = sam.append("owner", "Sam")
      .append("status", true)
      .append("body", "Apply to Frogs,inc")
      .append("category", "internship");

    todoDocuments.insertMany(testDocs);
    todoDocuments.insertOne(Document.parse(sam.toJson()));

    //Todo: write todoController code. Uncomment below when written.
    todoController = new TodoController(db);
    queryParams = new HashMap<>();

  }

  private static String getAttribute(BsonValue val, String key){
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get(key)).getValue();
  }
  private static String getOwner(BsonValue val){
    return getAttribute(val, "owner");
  }

  @Test
  public void getAllTodos() {
    String jsonResult = todoController.getTodos(queryParams);
    BsonArray docs = BsonArray.parse(jsonResult);

    assertEquals("Should get 4 todos", 4, docs.size());
    List<String> owners = docs.stream().map(TodoControllerSpec::getOwner).sorted().collect(Collectors.toList());
    assertEquals("Owners should match", Arrays.asList("Jackson", "KK", "Nic", "Sam"), owners);
  }
  @Test
  public void getTodosByCategory() {
    queryParams.put("category", new String[]{"software design"});
    String jsonResult = todoController.getTodos(queryParams);
    BsonArray docs = BsonArray.parse(jsonResult);

    assertEquals("Should get 2 todos", 2, docs.size());
    List<String> owners = docs.stream().map(TodoControllerSpec::getOwner).sorted().collect(Collectors.toList());
    assertEquals("Owners should match", Arrays.asList("Jackson", "KK"), owners);
  }
  @Test
  public void getTodosByOwner() {
    queryParams.put("owner", new String[]{"Nic"});
    String jsonResult = todoController.getTodos(queryParams);
    BsonArray docs = BsonArray.parse(jsonResult);

    assertEquals("Should get 1 todo", 1, docs.size());
    List<String> owners = docs.stream().map(TodoControllerSpec::getOwner).sorted().collect(Collectors.toList());
    assertEquals("Owners should match", Arrays.asList("Nic"), owners);
  }
  @Test
  public void getTodosByStatus() {
    queryParams.put("status", new String[]{"true"});
    String jsonResult = todoController.getTodos(queryParams);
    BsonArray docs = BsonArray.parse(jsonResult);
    assertEquals("Should get 2 todos", 2, docs.size());

    List<String> owners = docs.stream().map(TodoControllerSpec::getOwner).sorted().collect(Collectors.toList());
    assertEquals("Owners should match", Arrays.asList("KK", "Sam"), owners);
  }
  @Test
  public void getTodosContains() {
    queryParams.put("contains", new String[]{"Lab"});
    String jsonResult = todoController.getTodos(queryParams);
    BsonArray docs = BsonArray.parse(jsonResult);
    assertEquals("Should get 2 todos", 2, docs.size());

    List<String> owners = docs.stream().map(TodoControllerSpec::getOwner).sorted().collect(Collectors.toList());
    assertEquals("Owners should match", Arrays.asList("Jackson", "Nic"), owners);
  }
  @Test
  public void getTodosMultipleParameters() {
    queryParams.put("contains", new String[]{"Lab"});
    queryParams.put("category", new String[]{"software design"});
    String jsonResult = todoController.getTodos(queryParams);
    BsonArray docs = BsonArray.parse(jsonResult);
    assertEquals("Should get 1 todo", 1, docs.size());

    List<String> owners = docs.stream().map(TodoControllerSpec::getOwner).sorted().collect(Collectors.toList());
    assertEquals("Owners should match", Arrays.asList("Jackson"), owners);
  }
  @Test
  public void getTodoById() {
    String todoJson = todoController.getTodo(todoId.toHexString());
    Document todo = Document.parse(todoJson);
    assertEquals("Name should be Sam", "Sam", todo.get("owner"));
    String todoJsonNotFound = todoController.getTodo(new ObjectId().toString());
    assertNull("Todo should not exist", todoJsonNotFound);
  }
  @Test
  public void addNewTodo() {
    String newTodo = todoController.addNewTodo("Elena", "true", "data structures", "Write next lab");
    assertNotNull("Todo Id should be returned when new todo is created", newTodo);
    queryParams.put("owner", new String[]{"Elena"});
    String jsonResult = todoController.getTodos(queryParams);
    BsonArray docs = BsonArray.parse(jsonResult);

    assertEquals("Should get 1 todo", 1, docs.size());
    List<String> owners = docs.stream().map(TodoControllerSpec::getOwner).sorted().collect(Collectors.toList());
    assertEquals("Owners should match", Arrays.asList("Elena"), owners);
  }
}
