// load the mongodb client
const {MongoClient, ObjectID} = require("mongodb");
const dbUrl = "mongodb://localhost:27017/testApp";

// use IIFE to connect to the database and query documents
(async () => {
    try {
        var client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
    } catch(err) {
        console.log("Connection error: ", err);
    }

    var db = client.db("University");
    console.log("Connected to the mongodb database");

    try {
        let docs = await db.collection("Students").find().toArray();
        console.log(JSON.stringify(docs, undefined, 2));
    } catch(err) {
        console.log("Query error: ", err);
    }

    try {
        let studentsCount = await db.collection("Students").find().count();
        console.log("Total students: ", studentsCount);
    } catch(err) {
        console.log("Query error: ", err);
    }

    try {
        let bioStudents = await db.collection("Students").find({field: "Biology"}).toArray();
        console.log(JSON.stringify(bioStudents, undefined, 2));
    } catch(err) {
        console.log("Query error: ", err);
    }

    client.close();
})();
