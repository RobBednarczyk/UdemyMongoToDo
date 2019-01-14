const {User} = require("./../models/user.js");

// define a middleware function
var authenticate = async (req, res, next) => {
    var token = req.header("x-auth");
    try {
        let user = await User.findByToken(token);
        // if there is no user
        if (!user) {
            // return Promise.reject();
            res.status(401).send();
        }

        //res.send(user);
        // modify the request object
        req.user = user;
        req.token = token;
        next();
    } catch(error) {
        // don't call the next() function if the auth didn't work as expected
        res.status(401).send({error});
    }
};

module.exports = {
    authenticate
}
