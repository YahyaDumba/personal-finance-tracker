const express = require('express');
const {register, login, verify} = require('../controllers/authController')

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/verify-email',verify);

module.exports = router;