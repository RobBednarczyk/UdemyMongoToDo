var env = process.env.NODE_ENV || "development";

// app config modification - manage local environment variables
if (env === "development" || env === "test") {
    // get access to variables from config.json file
    console.log("Env *****", env);
    var config = require("./config.json");

    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

// heroku sets the process.env.NODE_ENV = "production" by default
// console.log("Env *****", env);
//
// if (env === "development") {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:27017/ToDoApp";
// } else if (env === "test") {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:27017/ToDoAppTest"
// }
