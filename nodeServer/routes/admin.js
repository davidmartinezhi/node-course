const path = require('path');
const express = require('express');

const router = express.Router(); //mini express app that we can export

// /admin/add-product => GET

//on the router we register things like get, post, use, etc
router.get('/add-product', (req, res, next) => { //if it starts with /add-product, it will execute this middleware
    res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});

// /admin/add-product => POST
//app.get() is a method that allows us to register a new middleware function that will only be executed for incoming GET requests
router.post('/add-product', (req, res, next) => { //if it starts with /product, it will execute this middleware
    console.log(req.body); // this will be undefined because we need to add a middleware that parses the body
    res.redirect('/');
});

module.exports = router;