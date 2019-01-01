var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
const {ObjectID} = require("mongodb");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// configure routes
app.post("/todos", (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

// configure get route
app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        // sending back an object instead of an array - more flexible
        res.send({todos})
    }, (err) => {
        res.status(400).send(err);
    })
});

// GET id using async await
app.get("/todos/:id", async (req, res) => {
    var id = req.params.id;
    // bad client request
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({});
    }
    try {
        let doc = await Todo.findById(id);
        doc ? res.send(doc) : res.status(404).send();
    } catch (err) {
        res.status(404).send();
    }

});

// GET id using promises
// app.get("/todos/:id", (req, res) => {
//     var id = req.params.id;
//     if (!ObjectID.isValid(id)) {
//         return res.status(400).send({});
//     }
//     Todo.findById(id).then((doc) => {
//         doc ? res.send(doc) : res.status(404).send();
//     }, (err) => {
//         res.status(404).send();
//     })
//     OR
//     Todo.findById(id).then((doc) => {
//         doc ? res.send(doc) : res.status(404).send();
//     }).catch((e) => {
//      res.status(404).send();
//     })

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {
    app,
}
