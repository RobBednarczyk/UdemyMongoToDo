const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");
const {ObjectID} = require("mongodb");

const todos = [{
    _id: new ObjectID(),
    text:"First test todo"},
    {
    _id: new ObjectID(),
    text:"Second test todo"}];

// add a testing lifecycle method
// before each - run code before every test case
beforeEach((done) => {
    // empty the db before every test case - request
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

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
                Todo.find({text}).then((todos) => {
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
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
    })
});

describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should return todo doc", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                //console.log(res);
                expect(res.body.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it("should return 404 if todo not found", (done) => {
        let newId = new ObjectID();
        let strNewId = newId.toHexString();
        request(app)
            .get(`/todos/${strNewId}`)
            .expect(404)
            .end(done);
    });
    it("should return 400 for non object id", (done) => {
        request(app)
            .get("/todos/123")
            .expect(400)
            .end(done);
    });
})
