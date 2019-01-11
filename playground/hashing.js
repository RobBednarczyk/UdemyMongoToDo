const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
    id: 10
};

var token = jwt.sign(data, "123abc");
console.log(token);
var decoded = jwt.verify(token, "123abc");
console.log("decoded ", decoded);

// var message = "I'm user number 3";
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// console.log(`Length of the hash: ${hash.length}`);

// --- JSON web token ---

// data to be sent back from the server to the client
// var data = {
//     id: 4
// };
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// }

// middle man changes the data of the token
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();
//
// if (resultHash === token.hash) {
//     console.log("Data was not changed");
// } else {
//     console.log("Data was changed. Don't trust!");
// }
