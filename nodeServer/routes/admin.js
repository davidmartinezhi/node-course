const path = require("path");
const express = require("express");
const { check } = require("express-validator");
//const rootDir = require("../util/path"); // this will give us the path to the root directory of our project

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth"); // we get middleware to validate user session, arguments are read from left to right

const router = express.Router(); //mini express app that we can export

// /admin/add-product => GET
//on the router we register things like get, post, use, etc
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
//app.get() is a method that allows us to register a new middleware function that will only be executed for incoming GET requests
router.post(
  "/add-product",
  [
    check("title").isString().isLength({ min: 3 }).trim().withMessage("Please enter a valid title, it should have at least 3 characters."),
    check("imageUrl").isURL().withMessage("Please enter a valid URL."),
    check("price").isNumeric().withMessage("Please enter a valid price. It must be numeric"),
    check("description").isLength({ min: 5, max: 400 }).withMessage("Please enter a valid description. It must be between 5 and 400 characters."),
  ],
  isAuth,
  adminController.postAddProduct
);

// /admin/edit-product => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post(
  "/edit-product",
  [
    check("title").isString().isLength({ min: 3 }).trim().withMessage("Please enter a valid title, it should have at least 3 characters."),
    check("imageUrl").isURL().withMessage("Please enter a valid URL."),
    check("price").isNumeric().withMessage("Please enter a valid price. It must be numeric"),
    check("description").isLength({ min: 5, max: 400 }).withMessage("Please enter a valid description. It must be between 5 and 400 characters."),
  ],
  isAuth,
  adminController.postEditProduct
);

// /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
