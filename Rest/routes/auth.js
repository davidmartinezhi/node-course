const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

// PUT /auth/signup
router.put('/signup');

module.exports = router;