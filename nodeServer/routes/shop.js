const express = require('express');

const router = express.Router(); //mini express app that we can export

router.get("/", (req, res, next) => { //if it starts with /, it will execute this middleware. other routes must be on top
    console.log('In the next middleware');
    res.send('<h1>Hello from Express!</h1>');
});


module.exports = router;