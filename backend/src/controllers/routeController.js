const db = require('../config/dbConfig.js');

const registerRoute = (req, res) => {
  const { name, coordinates } = req.body;

  const coordinatesString = JSON.stringify(coordinates);

  const query = `
    INSERT INTO rutas (nombre, coordenadas)
    VALUES (?, ?)
  `;

  db.query(query, [name, coordinatesString], (err, results) => {
    if (err) {
      console.error('Error al registrar ruta:', err);
      return res.status(500).json({ success: false, message: 'Error al registrar la ruta' });
    }

    res.status(201).json({
      success: true,
      message: 'Ruta registrada exitosamente',
      id: results.insertId
    });
  });
};

const getRoutes = (req, res) => {
  const query = `SELECT * FROM rutas`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener rutas:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener las rutas' });
    }

    res.status(200).json({
      success: true,
      routes: results
    });
  });
};

// 🔥 ESTA ES LA FORMA CORRECTA 🔥
module.exports = { registerRoute, getRoutes };
