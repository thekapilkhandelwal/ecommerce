const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken"); // to generate token for signin
const expressJwt = require("express-jwt"); // authrisation check

// @desc    register a User
// @route   POST /api/users
// @access  Public
exports.signup = (req, res) => {
  // console.log("req-body: "+req.body);
  //req.body will not work if no body parser
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

// @desc    signin a User
// @route   POST /api/users
// @access  Public
// functionality to signin!!!
exports.signin = (req, res) => {
  // find user based on email]
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email do not exist please sign in",
      });
    }
    // if user found make sure email and pass match
    // you will get plain password from body..
    // hash that plain pass and hash that from encrypt function.
    // check if both hash match or not.

    // create authenticate method in user model!!
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match!",
      });
    }
    // generate a signed token with user id and secert. (this is added in .env file)'
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET); // which we got above

    // persist the token as t in cookie with expiry date
    res.cookie("t", { expire: new Date() + 9999 });

    // return res with user to frontend client
    const { _id, name, email, role } = user; // get these from user and sent them
    return res.json({ token, user: { _id, email, name, role } });
  });
};

// @desc    signout a User
// @route   POST /api/users
// @access  privates
exports.signout = (req, res) => {
  // clear cookie simple
  res.clearCookie("t");
  res.json({ message: "Signout Success " });
};

//to secure and not give access to the signed out user!
// use this method to give authorisation

exports.requireSignin = expressJwt({
  // cookie parser is required!
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // to set the algorithm.
  userProperty: "auth",
});

// 2 middleawre
// first requestSignIn will work !
exports.isAuth = (req, res, next) => {
  // console.log(req);
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }

  next();
};

// middleware for admin check.. since role=0 is for user.
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource! Access denied",
    });
  }
  next();
};
