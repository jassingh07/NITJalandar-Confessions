//jshint esversion:6
const test = require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.saltRounds);
// console.log(test);

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

//encryption applied to password field
//encryption done because in database password was clearly visible which we don't want if multiple people
//can access the database
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    // console.log(req.body);
    User.findOne({ username: req.body.username })
      .then((result) => {
        if (result) {
          bcrypt
            .compare(req.body.password, result.password)
            .then((matchFound) => {
              if (matchFound) res.render("secrets");
              else res.send("Incorrect Password entry, plz try again");
            });
        } else {
          res.send("Email entered was incorrect, plz try again!!");
        }
      })
      .catch((err) => {
        res.send(
          "Server Error: Unable to login currently, plz try again later"
        );
      });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    bcrypt
      .hash(req.body.password, saltRounds)
      .then((hash) => {
        const newUser = new User({
          username: req.body.username,
          password: hash,
        });
        // console.log(req.body);
        newUser
          .save()
          .then((result) => {
            res.render("secrets");
          })
          .catch((err) => {
            res.send(
              "Server Error: Unable to register currently, plz try again later!!"
            );
          });
      })
      .catch((err) => {
        res.send(
          "Server Error: Unable to provide Secure registration at the moment, plz try again later!!"
        );
      });
  });
