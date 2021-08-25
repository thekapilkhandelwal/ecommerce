const express = require("express");
const router = express.Router();

const {requireSignin, isAuth, isAdmin} = require("../controllers/auth");
const { userById, read, update } = require("../controllers/user");


// without isAuth we were just checking if the current user is signed
// in or not, now with isAuth we are also checking if the current 
// user is the user with the id or not, by checking the authid 
// with the stored id !
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile 
    });
});     

router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);

//router method
// anytime there is a parameter called userId it will call userById method
router.param("userId", userById); 


module.exports = router;
    