const request = require('supertest');
const express = require('express');
require('../mongoTestingConfig');
const app = express();
const index = require('../routes/index');

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

// might need to add stuff to database beforehand... how do I go about that.
beforeAll(() => {

})

describe('login route', () => {

    test('successful login', done => {
        request(app)
        .post('/login')
        .type('form')
        .send({username: 'user', password: 'Abc123'})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            return done();
        })
        // .end((err, res) => {
        //     expect(req.status).to.equal(201)
        //     done()
        // })

    })

    test('unsuccessful login', done => {
        request(app)
        .post('/login')
        .type('form')
        .send({username: 'nonExistentUser', password: 'Abc123'})
        .expect(301)
        .end((err, res) => {
            if (err) return done(err);
            return done();
        })
        // .end((err, res) => {
        //     expect(req.status).to.equal(201)
        //     done()
        // })

    })

})

// test getting messages from chat when accessing chatid



