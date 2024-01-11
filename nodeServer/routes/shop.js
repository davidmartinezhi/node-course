const path = require('path');

const express = require('express');

const rootDir = require("../util/path"); // this will give us the path to the root directory of our project
const adminData = require("./admin");

const router = express.Router(); //mini express app that we can export

router.get("/", (req, res, next) => { //if it starts with /, it will execute this middleware. other routes must be on top
    const products = adminData.products;
    res.render("shop", {prods: products, docTitle: "Shop"});
});


module.exports = router;