// load the mongodb client
const {MongoClient, ObjectID} = require("mongodb");
const dbUrl = "mongodb://localhost:27017/testApp";

// use IIFE to connect to database and insert data
(async () => {
    try {
        var client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
        var db = client.db("University");
        console.log("Connected to the mongodb server");
    } catch(err) {
        console.log("Connection error: ", err);
    }

    try {
        var doc = await db.collection("Students").insertOne({
            name: "Grazyna",
            age: 20,
            field: "Biology"
        });
        console.log(JSON.stringify(doc.ops[0], undefined, 2));
        // console.log(doc.ops[0]._id.getTimestamp());
        // console.log(doc.ops[0]._id.toString());
        // console.log(doc.ops[0]._id.valueOf());
    } catch(err) {
        console.log("Insert data error: ", err);
    }

    client.close();
})();
