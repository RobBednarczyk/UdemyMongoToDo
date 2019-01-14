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
        doc ? res.send({todo: doc}) : res.status(404).send();
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

app.delete("/todos/:id", async (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({text: "ObjectId not valid"});
    }
    try {
        let removedDoc = await Todo.findByIdAndRemove(id);
        removedDoc ? res.status(200).send({todo: removedDoc}) : res.status(404).send({text: "Could not delete document"});
    } catch(err) {
        res.status(400).send({text: "There was a problem"});
    }

});

// update todo items
app.patch("/todos/:id", (req, res) => {
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

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {new: true}).then((todo) => {
        todo ? res.send({todo}) : res.status(404).send()
    }).catch((e) => {
        res.status(400).send();
    });
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

})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});



module.exports = {
    app,
}
