const express = require('express');
const router = express.Router();
const { registerRoute,getRoutes } = require('../src/controllers/routeController.js');


router.post('/registerroute', registerRoute);
router.get('/getroutes', getRoutes);

module.exports = router;
