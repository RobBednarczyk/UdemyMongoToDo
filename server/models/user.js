const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

// define user schema
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        // verifies that the property email does not have the same value as other users
        unique: true,
        validate: {
            // validator: (value) => {
            //     return validator.isEmail(value)
            // },
            // this function will work on its own
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// override method
userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ["_id", "email"]);
}

// object - instance methods
userSchema.methods.generateAuthToken = async function() {
    var user = this;
    var access = "auth";
    // sign the payload - data using the secret salt
    var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

    // old version
    // user.tokens.push({
    //     access,
    //     token
    // });
    user.tokens = user.tokens.concat([{access, token}]);

    // promises
    return user.save().then(() => {
        return token;
    });

}

// compile user schema
var User = mongoose.model("User", userSchema);

module.exports = {
    User,
}
