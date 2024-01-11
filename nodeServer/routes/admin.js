const path = require('path');
const express = require('express');

const rootDir = require("../util/path"); // this will give us the path to the root directory of our project

const router = express.Router(); //mini express app that we can export


const products = [];

// /admin/add-product => GET
//on the router we register things like get, post, use, etc
router.get('/add-product', (req, res, next) => { //if it starts with /add-product, it will execute this middleware
    //res.sendFile(path.join(rootDir, "views", "add-product.html"));
    res.render("add-product", {docTitle: "Add Product"});
});

// /admin/add-product => POST
//app.get() is a method that allows us to register a new middleware function that will only be executed for incoming GET requests
router.post('/add-product', (req, res, next) => { //if it starts with /product, it will execute this middleware
    products.push({title: req.body.title}); // req.body is provided by body-parser
    res.redirect('/');
});

exports.routes = router; // this will export the router object
exports.products = products; // this will export the products array