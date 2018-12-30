// fetch the mongo client from the mongodb lib
// const MongoClient = require("mongodb").MongoClient;
// ES6 create two variables by destruct an object
const {MongoClient, ObjectID} = require("mongodb");


// create a url to connect
const dbUrl = "mongodb://localhost:27017/ToDoApp" ;
const userName = "Robbon";
// connect to database
MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, client) => {
    if (err) {
        // return statement prevents the rest of the function from executing
        return console.log("Unable to connect to mongodb server");
    }
    console.log("Connected to mongodb server");

    const db = client.db("ToDoApp");

    // find returns mongodb cursor - in this case: fetch everything
    // db.collection("Todos").find().toArray().then((documents) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(documents, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // })

    // query by the "completed" property
    // db.collection("Todos").find({completed: false}).toArray().then((documents) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(documents, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    // count all the documents
    // db.collection("Todos").find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    //     //console.log(JSON.stringify(documents, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });
    db.collection("Users").find({name: userName}).toArray().then((docs) => {
        //console.log(`Todos count: ${count}`);
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log("Unable to fetch todos", err);
    });

    // client.close();
});
