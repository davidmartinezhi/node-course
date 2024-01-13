const path = require("path");
const express = require("express");

//const rootDir = require("../util/path"); // this will give us the path to the root directory of our project

const productsController = require("../controllers/products");

const router = express.Router(); //mini express app that we can export


// /admin/add-product => GET
//on the router we register things like get, post, use, etc
router.get("/add-product", productsController.getAddProduct);

// /admin/add-product => POST
//app.get() is a method that allows us to register a new middleware function that will only be executed for incoming GET requests
router.post("/add-product", productsController.postAddProduct);

module.exports = router;