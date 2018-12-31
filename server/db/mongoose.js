// mongoose configuration file

const mongoose = require("mongoose");

// set the mongoose to use promises
mongoose.Promise = global.Promise;
// connect to the db
mongoose.connect("mongodb://localhost:27017/ToDoApp", {useNewUrlParser: true});

module.exports = {
    mongoose,
}
