//jshint esversion:6
const test = require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const encrypt = require("mongoose-encryption");

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

// console.log(test);to test .env file

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});//ENCRYPTION
//encryption applied to password field
//plugin is way to apply prebuilt packages (i.e more functionalities) to all documents of this schema
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
        if (result){  
            if(result.password == req.body.password)
                res.render("secrets");
            else
                res.send("Password entered incorrent plz try again!!");
        } else {
          res.send("Email entered was incorrect, plz try again!!");
        }
        // console.log(result);
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
    const newUser = new User(req.body);
    console.log(req.body);
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
  });
