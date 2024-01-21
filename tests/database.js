// need supertest and jest

const index = require('../routes/index');

// const require = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', index);
