const path = require('path');

const express = require('express');

const router = express.Router(); //mini express app that we can export

router.get("/", (req, res, next) => { //if it starts with /, it will execute this middleware. other routes must be on top
    res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});


module.exports = router;