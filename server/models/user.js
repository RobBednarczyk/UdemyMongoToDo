const mongoose = require("mongoose");

// define user schema
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    }
});

// compile user schema
var User = mongoose.model("User", userSchema);

module.exports = {
    User,
}
