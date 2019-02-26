## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. The UserController constructor initializes the User Controller with a MongoCollection from the users collection in 
  the database provided by the constructor's input parameter. In the server file we connect to a  mongo database and 
  pass it to our controllers to handle the data.
1. We use the MongoCollection class's built in find method to limit the collection to users with the provided id. To 
 match on the correct we convert the id from a string to an ObjectId. We return the first user that matches the 
 condition, or null if one does not exist.
1. We pass the getUsers() method query params in the form of key-value pairs. To sort by age, we pass a map containing 
an age key and whatever age we would like to filter by. Every expected key (currently only age and company) that exists
in the map will be added to the filterDoc and only users that match the conditions in filterDoc will be returned.
1. Document objects are a representation of the json objects we are retrieving from the mongo database.
1. This method connects to the test database and empties the users collection. It then fills it with only the data that
the tests expect. This makes it so that the tests can run reliably knowing what data they will be working with.
1. This tests the userController.getUsers() method passing it the parameters to only get users who have an age of 37.
It confirms that it worked correctly by checking the length of the returned data as well as the names of each returned
item.
1. UserRequestHandler.addNewUser() handles the HTTP request and response. It parses the information and calls
UserController.addNewUser(). This method handles only the building of the Document and adding it to the database.
