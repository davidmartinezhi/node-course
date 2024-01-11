const path = require('path');

const rootDir = require('../util/path');

const express = require('express');

const router = express.Router();

// /user/add-user => GET
router.get("/add-user", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "add-user.html"));
});

// /user/add-user => POST
router.post("/add-user", (req, res, next) => {
    console.log(req.body);
    res.redirect("/");
});


module.exports = router;