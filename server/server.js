require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
var {authenticate} = require("./middleware/authenticate.js");
const {ObjectID} = require("mongodb");

var app = express();

// create an env variable for heroku
// legacy - before testing, dev, production division
// const port = process.env.PORT || 3000;
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// configure routes
// make it a private route - only logged in users can add new todos
app.post("/todos", authenticate, async (req, res) => {

    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
    });
    try {
        let newTodo = await todo.save();
        res.send(newTodo);
    } catch(err) {
        res.status(400).send(err);
    }

    // todo.save().then((doc) => {
    //     res.send(doc);
    // }, (err) => {
    //     res.status(400).send(err);
    // });
});

// configure get route
app.get("/todos", authenticate, async (req, res) => {
    try {
        let todos = await Todo.find({
        _creator: req.user._id
        });
        res.send({todos});
    } catch (err) {
        res.status(400).send(err);
    }
    // Todo.find({
    //     _creator: req.user._id
    // }).then((todos) => {
    //     // sending back an object instead of an array - more flexible
    //     res.send({todos})
    // }, (err) => {
    //     res.status(400).send(err);
    // })
});

// GET id using async await
// the authenticate middleware makes sure the user is logged in and gives us
// access to the user and token via the request object
app.get("/todos/:id", authenticate, async (req, res) => {
    var id = req.params.id;
    // bad client request
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({});
    }
    try {
        //let doc = await Todo.findById(id);
        let todoItem = await Todo.findOne({
            // query by todo Id and the user Id
            _id: id,
            _creator: req.user._id
        })
        todoItem ? res.send({todo: todoItem}) : res.status(404).send();
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

app.delete("/todos/:id", authenticate, async (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({text: "ObjectId not valid"});
    }
    try {
        //let removedDoc = await Todo.findByIdAndRemove(id);
        let removedDoc = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });

        removedDoc ? res.status(200).send({todo: removedDoc}) : res.status(404).send({text: "Could not delete document"});
    } catch(err) {
        res.status(400).send({text: "There was a problem"});
    }

});

// update todo items
app.patch("/todos/:id", authenticate, async (req, res) => {
    var id = req.params.id;
    // pick the properties that can be updated by the user
    var body = _.pick(req.body, ["text", "completed"]);

    if (!ObjectID.isValid(id)) {
        return res.status(400).send({text: "ObjectId not valid"});
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // old version - pre authenticate
    // Todo.findByIdAndUpdate(id, {
    //     $set: body
    // }, {new: true}).then((todo) => {
    //     todo ? res.send({todo}) : res.status(404).send()
    // }).catch((e) => {
    //     res.status(400).send();
    // });
    try {
        let updatedTodo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
            $set: body
        }, {
            new: true
        });
        updatedTodo ? res.send({updatedTodo}) : res.status(404).send()
    } catch (err) {
        res.status(400).send();
    }

});

// POST /users
app.post("/users", async (req, res) => {
    let body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);
    try {
        let savedDoc = await user.save();
        let token = await savedDoc.generateAuthToken();
        // x-create a custom header
        res.header("x-auth", token).send({user: savedDoc});
    } catch(err) {
        res.status(400).send(err);
    }
});



// create a new private route - using middleware authenticate
app.get("/users/me", authenticate,  async (req, res) => {
    // req.header - getting value from header
    // var token = req.header("x-auth");
    // try {
    //     let user = await User.findByToken(token);
    //     // if there is no user
    //     if (!user) {
    //         // return Promise.reject();
    //         res.status(401).send();
    //     }
    //
    //     res.send(user);
    // } catch(error) {
    //     res.status(401).send({error});
    // }
    res.send(req.user);

});

// POST route /users/login
app.post("/users/login", async (req, res) => {
    let body = _.pick(req.body, ["email", "password"]);
    // fetch the user using their credentials
    try {
        let user = await User.findByCredentials(body.email, body.password);
        //res.send(user);
        // generate a new token
        let token = await user.generateAuthToken();
        res.header("x-auth", token).send(user);
    } catch(e) {
        res.status(400).send();
    }

});

app.delete("/users/me/token", authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (err) {
        res.status(400).send(err);
    }

});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});




module.exports = {
    app,
}
