const { User } = require('../models/user.model');


module.exports = async (req, res, next) => {
    const token = req.cookies.auth;

    const user = await User.getUser(token);
    if (!user) return res.status(401).send('unauthenticated');
    req.user = user;
    next();
}