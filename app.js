const express = require("express");
const MongoStore = require("connect-mongo");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./mongoConfig");
require("dotenv").config();

const initializePassport = require("./passportConfig");
initializePassport(passport);

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

// app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // proxy: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      httpOnly: process.env.MODE === "prod",
      secure: process.env.MODE === "prod",
      sameSite: process.env.MODE === "prod" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

module.exports = app;
