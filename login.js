const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const path = require("path");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "nodelogin",
});
constapp = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname, "static")));
app.get("/", function (request, response) {
  response.sendFile(path.join(dirname + "/signup.html"));
});
app.get("/login", function (request, response) {
  response.sendFile(path.join(dirname + "/login.html"));
});
app.post("/auth", function (request, response) {
  let username = request.body.username;
  let email = request.body.email;
  let password = request.body.password;
  let confirmpassword = request.body.confirmpassword;
  if (username && email && password && confirmpassword) {
    if (password === confirmpassword) {
      connection.query(
        "insert into accounts(username,password,email)values(?,?,?)",
        [username, password, email],
        function (error, results, fields) {
          if (error) throwerror;
          else if (!error) {
            request.session.signup = true;
            request.session.username = username;
            response.redirect("/login");
          } else {
            response.send("Incorrect details");
          }
          response.end();
        }
      );
    }
  } else {
    response.send("Please correct details");
    response.end();
  }
});
app.post("/auth1", function (request, response) {
  let username = request.body.username;
  let password = request.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect("/home");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("PleaseenterUsernameandPassword!");
    response.end();
  }
});
app.get("/home", function (request, response) {
  if (request.session.loggedin) {
    response.send("Welcome " + request.session.username + "!!!");
  } else {
    response.send("Please login to view this page!");
  }
  response.end();
});
app.listen(3000);
