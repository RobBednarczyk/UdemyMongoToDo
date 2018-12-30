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

    // db.collection("Todos").findOneAndUpdate({
    //     _id: new ObjectID("5c293730dbed23f71d7306b7")
    // }, {
    //     // update operators
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // })

    db.collection("Users").findOneAndUpdate({
        name: "Jenny"
    }, {
        $set: {
            name: "Katie"
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    // client.close();
});
