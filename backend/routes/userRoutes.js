const express = require('express');
const router = express.Router();
const { registerUser, checkUsername } = require('../src/controllers/userController');

router.post('/register', registerUser);
router.get('/check-username', checkUsername);

module.exports = router;
