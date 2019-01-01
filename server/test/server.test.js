const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");

// add a testing lifecycle method
// before each - run code before every test case
beforeEach((done) => {
    // empty the db before every test case - request
    Todo.remove({}).then(() => done());
})

describe("POST /todos", () => {
    // specify done as it is an async request
    it("should create a new todo", (done) => {
        var text = "Test todo text";
        request(app)
            .post("/todos")
            .send({text})
            // start making assertions
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    // wrap up the tests printing the error to the screen
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                })
            })
    });

    it("should not create todo with invalid body data", (done) => {
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, req) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    })
})
