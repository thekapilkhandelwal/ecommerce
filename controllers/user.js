// get user model!
const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => { // call back func.
        if(err || !user) { // if user not found
            return res.status(400).json({
                error: "user not found! "
            });
        }
        req.profile = user; // get profile from the request param
        next(); // since it is a middleware, this will make it move 
        // next phase. 
    });
}; 


exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.update = (req, res) => {
    // find the user and update it! newly updated value will be sent as json
    User.findOneAndUpdate(
        {_id: req.profile._id}, 
        {$set: req.body}, 
        {new: true},
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: "you are not authorised to perform this."
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
}