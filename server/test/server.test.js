const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");
const {User} = require("./../models/user.js");
const {ObjectID} = require("mongodb");

const {todos, populateToDos, users, populateUsers} = require("./seed/seed.js");

// add a testing lifecycle method
// before each - run code before every test case
beforeEach(populateUsers);
beforeEach(populateToDos);

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
                expect(res.body.todo.text).toBe(todos[0].text);
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
});

describe("DELETE /todos/:id", () => {
    it("should remove a todo", (done) => {
        var hexId = todos[0]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                // now using the expect LIBRARY
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it("should return 404 if todo not found", (done) => {
        let newId = new ObjectID();
        let strNewId = newId.toHexString();
        request(app)
            .delete(`/todos/${strNewId}`)
            .expect(404)
            .end(done);
    });

    it("should return 400 for non object id", (done) => {
        request(app)
            .delete("/todos/1234")
            .expect(400)
            .end(done);
    });

});

describe("PATCH /todos/:id", () => {
    it("should update the todo", (done) => {
        // grab id of first item
        // update the text, set completed = true
        // assert: 200 back - basic system
        // custom assertion: res.body has text updated, completed is true and completedAt is a number
        var id = todos[0]._id.toHexString();
        var updatedText = "I've just completed it!";
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: updatedText,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedText);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe("number");
            })
            .end(done);
    });

    it("should clear completedAt when todo is not completed", (done) => {
        // grab id of second to do item
        // update the text, set completed = false
        // 200
        // text is changed, completed is false, completedAt is null
        let id = todos[1]._id.toHexString();
        let updatedText = "I have not completed it yet!";
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: updatedText,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedText);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    })
});

describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
        .get("/users/me")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            // using expect library; toHexString the ObjectId
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
        .get("/users/me")
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({"error" : "Error: token not verified",});
        })
        .end(done);
    });
});

describe("POST /users/", () => {

    it("should create a user", (done) => {
        var email = "example@example.com";
        var password = "123mnb!";
        request(app)
        .post("/users/")
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers["x-auth"]).toBeTruthy();
            expect(res.body.user._id).toBeTruthy();
            expect(res.body.user.email).toBe(email);
        })
        .end(async (err) => {
            if (err) {
                return done(err);
            }
            try {
                let user = await User.findOne({email});
                expect(user).toBeTruthy();
                // the password should be hashed
                expect(user.password).not.toBe(password);
                done();
            } catch (err) {
                done(err);
            }

        });
    });

    it("should return validation errors if request invalid", (done) => {
        let email = "zxcv234234";
        let password = "ad"
        request(app)
        .post("/users/")
        .send({email, password})
        .expect(400)
        .end(done)
    });

    it("should not create user if email in use", (done) => {
        let email = users[0].email;
        let password = "fasdfewr";
        request(app)
        .post("/users/")
        .send({email, password})
        .expect(400)
        .end(done)
    });
});

describe("POST /users/login", () => {

    it("should login user and return auth token", (done) => {
        request(app)
        .post("/users/login")
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers["x-auth"]).toBeTruthy();
        })
        .end(async (err, res) => {
            if (err) {
                return done(err);
            }
            try {
                let user = await User.findById(users[1]._id);
                //console.log(user.tokens[0]);
                // user1 has only one token
                expect(user.tokens[0]).toHaveProperty("access", "auth");
                expect(user.tokens[0]).toHaveProperty("token", res.headers["x-auth"]);
                done();
            } catch (err) {
                done(err);
            }

        })
    });

    it("should reject invalid login", (done) => {
        request(app)
        .post("/users/login")
        .send({
            email: users[1].email,
            password: "deliberatlyWrongPassword"
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers["x-auth"]).not.toBeTruthy();
        })
        .end(async (err, res) => {
            if (err) {
                return done(err);
            }
            try {
                let user = await User.findById(users[1]._id);
                expect(user.tokens.length).toBe(0);
                done();
            } catch(err) {
                done(err);
            }
        })
    });
});

describe("DELETE /users/me/token", () => {
    it("should remove auth token on logout", (done) => {
        request(app)
        .delete("/users/me/token")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .end(async (err, res) => {
            if (err) {
                return done(err);
            }
            try {
                let user = await User.findById(users[0]._id);
                expect(user.tokens.length).toBe(0);
                done();
            } catch(err) {
                done(err);
            }
        })
    })
})
