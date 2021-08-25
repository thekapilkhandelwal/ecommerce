const express = require("express");
const router = express.Router();

const { isAuth, requireSignin, isAdmin } = require("../controllers/auth");
const { create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo } = require("../controllers/product");
const {userById} = require("../controllers/user");

router.get("/product/:productId", read);
//router method
// user should be authenticated, signedin, and admin! 
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete("/product/:productId/:userId",requireSignin, isAuth, isAdmin, remove );
router.put("/product/:productId/:userId",requireSignin, isAuth, isAdmin, update );

router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
// post used as we are sending some data from front end to back end 
// NOTE: this is not sent in params! 
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
