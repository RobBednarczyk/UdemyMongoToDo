// mongoose configuration file

const mongoose = require("mongoose");

// set the mongoose to use promises
mongoose.Promise = global.Promise;
// connect to the db
// check if there is a db on heroku; if not use the localhost uri
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ToDoApp", {useNewUrlParser: true});
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});


module.exports = {
    mongoose,
}
