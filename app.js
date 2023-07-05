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
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");


// console.log(test);
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session()); //use passport to deal with session

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  googleId: String, //because new documents were created on each login, during google authentication, due to absence of this field.
  secrets: [String],
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    //after google server and local authentication is done then this callback
    //will be triggered and we will save profile on our database
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile);//check what info google sends for user
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
      //remember that after google authentication we would be getting access token
      //through which we would be requesting for user's data from google
      //findOrCreate was not a inbuilt function initally hence imported a package for it
      //which was created so that we don't have to write this fxn
    }
  )
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
//passport will hash and salt passwords for us

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});
//this process of serializing and deserializing is general for all strategies
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});


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
    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
        //authenticating using local strategy
      }
    });
  });

app.route("/logout").get((req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      res.redirect("/secrets");
    }
    res.redirect("/");
  });
});

app
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile"] }));
//on "google" server
//authenticating using google strategy and asking for google profile of user

//then will be redirected to below route
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  }
);
//authenticating them "locally" and saving session for user

app.route("/secrets").get((req, res) => {
  if (req.isAuthenticated()) {
    User.find({secrets: {$ne: null}}).then((result) => {
      if (result) {
        res.render("secrets", { userWithSecrets: result });
      }
      //else situation will not come
    });
  } else {
    res.redirect("/login");
  }
});

app
  .route("/secrets/submit")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render("submit");
    } else {
      res.redirect("/login");
    }
  })
  .post((req, res) => {
    if (req.isAuthenticated()) {
      User.findById(req.user.id).then((result) => {
        if (result) {
          const anotherSecret = req.body.secret;
          result.secrets.push(anotherSecret);
          result.save();
          res.redirect("/secrets");
        } else {
          res.redirect("/login");
        }
      }).catch(err =>{
        res.write("Database Error: Unable to fetch secrets<br>");
        res.write("<a href='/secrets'>Try reading your secrets again</a>")
      })
    } else {
      res.redirect("/login");
    }
  });
