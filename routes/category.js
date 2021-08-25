const express = require("express");
const router = express.Router();

const { isAuth, requireSignin, isAdmin } = require("../controllers/auth");
const { create, categoryById, read, remove, update, list } = require("../controllers/category");
const {userById} = require("../controllers/user");

//router method
// user should be authenticated, signedin, and admin! 
router.get("/category/:categoryId", read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, update);
router.get("/categories", list);

router.param("categoryId", categoryById);
router.param("userId", userById);




module.exports = router;
