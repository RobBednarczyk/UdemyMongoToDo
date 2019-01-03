var env = process.env.NODE_ENV || "development";

// heroku sets the process.env.NODE_ENV = "production" by default
console.log("Env *****", env);

if (env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/ToDoApp";
} else if (env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/ToDoAppTest"
}
