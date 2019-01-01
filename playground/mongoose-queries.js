const {ObjectID} = require("mongodb");
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// ----
// async await solution
// var userByID = async function(id) {
//     try {
//         let user = await User.findById(id);
//         user ? console.log(user) : console.log("User not found");
//     } catch (err) {
//         console.log("There was an error");
//     }
// }
//
// userByID("5c2a703098bf381bb47ecd2b");

// ---
// UDEMY solution
User.findById("5c2a703098bf381bb47ecd2b").then((user) => {
    if (!user) {
        console.log("Unable to find user");
    }
    console.log(JSON.stringify(user, undefined, 2));
}, (err) => {
    console.log(err);
})


// if (!ObjectID.isValid(id)) {
//     console.log("ID not valid");
// }
//
// var id = "5c2b82a05e937a2b530ce296";
// var tweakedId = "6c2b82a05e937a2b530ce296";
//
// Todo.find({
//     _id: tweakedId,
// }).then((todos) => {
//     console.log("Todos ", todos);
// });
//
// Todo.findOne({
//     _id: tweakedId,
// }).then((todo) => {
//     console.log("Todo ", todo);
// });
//
// Todo.findById(tweakedId).then((todo) => {
//     if (!todo) {
//         return console.log("Id not found");
//     }
//     console.log("Todo by Id:", todo);
// });

// async function threeQuerries() {
//     var findOne = await Todo.findOne({
//         _id: id,
//     });
//
//     var findAll = await Todo.find();
//     var findById = await Todo.findById(id);
//
//     console.log("Find one", findOne);
//     console.log("Find all", findAll);
//     console.log("Find by Id", findById);
// }

// threeQuerries();
