const path = require("path");

const express = require("express");

const productsController = require("../controllers/products");

const router = express.Router(); //mini express app that we can export

router.get("/", productsController.getProducts);

module.exports = router;
