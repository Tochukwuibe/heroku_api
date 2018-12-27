const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secrete = 'supersecrete';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 2,
        maxlength: 200,
        unique: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
        maxlength: 50
    }
})


userSchema.statics.login = function (email, password) {
    return this.findOne({ email }).then(function (user) {

        if (!user) return null;

        return bcrypt.compare(password, user.password).then(function (matches) {
            if (matches) {
                return user;
            } else {
                return null;
            }
        })
    })
}



userSchema.methods.getToken = function () {
    return jwt.sign({ ...this }, secrete);
}


userSchema.statics.getUser = function (token) {
    if (!token) return null;
    const decoded = jwt.verify(token, secrete);

    return this.findOne({ _id: decoded['_doc']['_id'] }).then((user) => {
        if (!user) return null;
        return user;
    })
}

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10)
            .then((salt) => bcrypt.hash(user.password, salt))
            .then((hash) => user.password = hash)
            .then(() => next())
            .catch((err) => next(err))
    } else {
        next();
    }

})


const User = mongoose.model('User', userSchema)

module.exports = {
    userSchema,
    User
}