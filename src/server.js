const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users/index');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || '3000';

mongoose.Promise = global.Promise;


async function init() {
    const app = express();
    connect();

    app.use(bodyParser.json());
    app.use(cookieParser())
    app.use('/api/users', users);



    app.listen(port, (err) => !!err ? console.log('an error occoured') : console.log(`server listening on port: ${port}`))
}


async function connect() {
    const url = 'mongodb://localhost/react_test';
    return mongoose.connect(url, { useNewUrlParser: true })
        .then(() => console.log('connected to mongodb'))
        .catch(() => console.log('connection to db failed'))
}


init();
