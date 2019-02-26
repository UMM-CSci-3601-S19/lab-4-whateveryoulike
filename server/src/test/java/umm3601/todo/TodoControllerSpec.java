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

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testDocs = new ArrayList<>();
    testDocs.add(Document.parse("{\n" +
      "                    owner: \"KK\",\n" +
      "                    status: \"true\",\n" +
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
    //todoController = new TodoController(db);
  }

  @Test
  public void getAllTodos() {

  }

}
