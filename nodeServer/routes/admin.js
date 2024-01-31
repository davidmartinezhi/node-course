const path = require("path");
const express = require("express");

//const rootDir = require("../util/path"); // this will give us the path to the root directory of our project

const adminController = require("../controllers/admin");

const router = express.Router(); //mini express app that we can export


// /admin/add-product => GET
//on the router we register things like get, post, use, etc
router.get("/add-product", adminController.getAddProduct);

// // /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
//app.get() is a method that allows us to register a new middleware function that will only be executed for incoming GET requests
router.post("/add-product", adminController.postAddProduct);

// // /admin/edit-product => GET
router.get("/edit-product/:productId", adminController.getEditProduct);

// // /admin/edit-product => POST
router.post("/edit-product", adminController.postEditProduct);

// // /admin/delete-product => POST
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;