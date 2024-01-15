const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router(); //mini express app that we can export

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", shopController.getCart);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
