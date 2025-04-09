const express = require('express');
const router = express.Router();
const { registerRoute } = require('../src/controllers/routeController.js'); // Asegúrate de que la ruta sea correcta

router.post('/registerroute', registerRoute);  

module.exports = router;
