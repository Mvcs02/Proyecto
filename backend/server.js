const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const routeRoutes = require('./routes/routeRoutes');

const app = express();

// Configuración CORS
app.use(cors({
  origin: 'http://localhost:5173', // Frontend (Vue) URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/api', userRoutes);       
app.use('/api', routeRoutes);      

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
