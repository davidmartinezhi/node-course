const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router(); //mini express app that we can export

router.get("/", shopController.getProducts);

router.get("/products");

router.get("/cart");

router.get("/checkout");

module.exports = router;
