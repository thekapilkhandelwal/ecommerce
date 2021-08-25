const express = require("express");
const router = express.Router();

const { signup, signin, signout, requireSignin } = require("../controllers/auth");
const {userSignupValidator} = require("../validator");

//router method
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout); // this uses get method


module.exports = router;
