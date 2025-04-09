const express = require('express');
const router = express.Router();
const { registerPersona } = require('../src/controllers/userController');

router.post('/register', registerPersona);

module.exports = router;
