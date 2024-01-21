require('./mongoConfig')
require('dotenv').config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');


const indexRouter = require('./routes/index');

const app = express();

// require cors middleware. configure such that it takes frontend URL.
// may require sessions maybe?

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// set up cors here
// not sure if i need credentials true...
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}))

module.exports = app;
