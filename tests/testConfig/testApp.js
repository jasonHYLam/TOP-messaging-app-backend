const express = require("express");
const session = require("express-session");
const index = require("../../routes/index");
const passport = require("passport");
const initializePassport = require("../../passportConfig");

initializePassport(passport);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: process.env.MODE === "prod",
      secure: process.env.MODE === "prod",
      sameSite: process.env.MODE === "prod" ? "none" : "lax",
    },
  }),
);

app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", index);

module.exports = app;
