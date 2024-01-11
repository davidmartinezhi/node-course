const path = require('path');

const express = require('express');

const rootDir = require("../util/path"); // this will give us the path to the root directory of our project

const router = express.Router(); //mini express app that we can export

router.get("/", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "home.html")); //send the home.html file
});

module.exports = router; //export the router object