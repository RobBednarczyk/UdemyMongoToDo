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

    // delete many
    // db.collection("Todos").deleteMany({text: "Eat lunch"}).then((result) => {
    //     //console.log(`Todos count: ${count}`);
    //     console.log(JSON.stringify(result, undefined, 2));
    // });

    // delete one
    // db.collection("Todos").deleteOne({text: "Eat lunch"}).then((result) => {
    //     console.log(result);
    // });

    // find one and delete
    // db.collection("Todos").findOneAndDelete({completed: false}).then((doc) => {
    //     console.log(doc);
    // });

    // challenge:
    // db.collection("Users").deleteMany({name: "Robbon"}).then((result) => {
    //     console.log(result);
    // });

    db.collection("Users").findOneAndDelete({_id: new ObjectID("5c28e1b986475e30e9eb4b98")})
        .then((result) => {
            console.log(result);
        });

    // client.close();
});
