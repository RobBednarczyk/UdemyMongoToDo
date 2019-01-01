var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

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

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {
    app,
}
