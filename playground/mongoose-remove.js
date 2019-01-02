const {ObjectID} = require("mongodb");
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// delete mult documents
// Todo.remove({})

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findOneAndRemove({_id: "5c2d24a7472c21103580010e"}).then((todo) => {
//     console.log(todo);
// });
// Todo.findByIdAndRemove
// Todo.findByIdAndRemove("5c2d24a7472c21103580010e").then((todo) => {
//     console.log(todo);
// });
