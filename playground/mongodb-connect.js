// fetch the mongo client from the mongodb lib
// const MongoClient = require("mongodb").MongoClient;
// ES6 create two variables by destruct an object
const {MongoClient, ObjectID} = require("mongodb");

// var obj = new ObjectID();
// console.log(obj);

// create a url to connect
const dbUrl = "mongodb://localhost:27017/ToDoApp" ;
// connect to database
MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, client) => {
    if (err) {
        // return statement prevents the rest of the function from executing
        return console.log("Unable to connect to mongodb server", err);
    }
    console.log("Connected to mongodb server");

    const db = client.db("ToDoApp");

    // insert a new document into a collection
    // db.collection("Todos").insertOne({
    //     text: "Something to do",
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log("Unable to insert todo");
    //     }
    //
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // insert new doc into Users (name: yourname, age: yourage, location: location)
    // db.collection("Users").insertOne({
    //     //_id: 123,
    //     name: "Robbon",
    //     age: 23,
    //     location: "Olsztyn",
    // }, (err, result) => {
    //     if (err) {
    //         return console.log("Unable to insert user", err);
    //     }
    //     // console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    client.close();
});
