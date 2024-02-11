require('./mongoConfig')
require('dotenv').config()

const passport = require('passport');
const initializePassport = require('./passportConfig');
initializePassport(passport);

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: process.env.MODE === 'prod',
        secure: process.env.MODE === 'prod',
        sameSite: process.env.MODE === 'prod' ? 'none' : 'lax',
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);


module.exports = app;
