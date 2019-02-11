const mongoose = require("mongoose");

// define todo schema
var todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        // remove leading or trailing whitespace
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Number,
        default: null,
    },
    // create an object variable - link to user
    _creator: {
        // type - id of a user
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// compile todo schema
var Todo = mongoose.model("Todo", todoSchema);

module.exports = {
    Todo,
}
