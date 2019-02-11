const {ObjectID} = require("mongodb");
const {Todo} = require("./../../models/todo.js");
const {User} = require("./../../models/user.js");
const jwt = require("jsonwebtoken");


// array of users to be added as a seed data
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: "andrew@example.com",
    password: "userOnePass",
    tokens: [
        {
            access: "auth",
            token: jwt.sign({_id: userOneId, access: "auth"}, process.env.JWT_SECRET).toString()
        }
    ]
}, {
    _id: userTwoId,
    email: "zico@brasil1982.com",
    password: "userTwoPass",
    // token added
    tokens: [
        {
            access: "auth",
            token: jwt.sign({_id: userTwoId, access: "auth"}, process.env.JWT_SECRET).toString()
        }
    ]
}];

const todos = [{
    _id: new ObjectID(),
    text:"First test todo",
    _creator: userOneId
    },
    {
    _id: new ObjectID(),
    text:"Second test todo",
    // tweak the initial todos for the patch test
    completed: true,
    completedAt: 333,
    _creator: userTwoId
    }];

// udemy version
// const populateToDos = (done) => {
//     // empty the db before every test case - request
//     Todo.remove({}).then(() => {
//         return Todo.insertMany(todos);
//     }).then(() => done());
// };

// async await version
const populateToDos = async () => {
    await Todo.remove({});
    await Todo.insertMany(todos);
    //done();
}

// udemy version
// const populateUsers = (done) => {
//     // empty the db before every test case - reques
//     User.remove({}).then(() => {
//         var userOne = new User(users[0]).save();
//         var userTwo = new User(users[1]).save();
//
//         // callback not fired until all the promises are resolved
//         return Promise.all([userOne, userTwo])
//     }).then(() => done());
// }

const populateUsers = async () => {
    await User.remove({});
    var userOne = await new User(users[0]).save();
    var userTwo = await new User(users[1]).save();
    //done();
}

module.exports = {
    todos,
    populateToDos,
    users,
    populateUsers
}
