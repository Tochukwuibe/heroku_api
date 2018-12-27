const express = require('express');
const { User } = require('../../models/user.model');
const auth = require('../../middlewaer/auth');

const users = express.Router();



users.post('/', (req, res) => {

    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) res.status(500).send(err)
        res.status(201).cookie('auth', doc.getToken()).send(doc);
    })

})


users.post('/login', async (req, res) => {
    const user = await User.login(req.body.email, req.body.password);
    if (user) {
        res.status(200).cookie('auth', user.getToken()).send('Login success');

    } else {
        res.status(400).send('Authentication failed');
    }
})

users.get('/', auth, async (req, res) => {
    res.status(200).send(req.user)
});

users.get('/', (req, res) => res.send([]))


module.exports = users;