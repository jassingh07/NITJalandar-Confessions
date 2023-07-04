//jshint esversion:6
const test = require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// console.log(test);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session()); //use passport to deal with session

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
userSchema.plugin(passportLocalMongoose);
//passport will hash and salt passwords for us

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser()); //create cookie for user identity
passport.deserializeUser(User.deserializeUser()); //decrypt information from cookie to verify user's identity

//encryption done because in database password was clearly visible which we don't want if multiple people
//can access the database

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    User.register({ username: req.body.username }, req.body.password)
      .then(() => {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/register");
      });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const user = new User(req.body);
    req.login(user, function(err) {
      if (err) { 
        console.log(err);
        res.redirect("/login");
      }
      else{
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    });
  });


  app.route("/logout")
  .get((req, res) => {
    req.logout( err => {
      if (err) { 
        console.log(err);
        res.redirect("/secrets");
      }
      res.redirect('/');
    });
  });

app.route("/secrets").get((req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});
