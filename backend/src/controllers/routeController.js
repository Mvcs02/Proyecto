const db = require('../config/dbConfig.js'); // Asegúrate de que la ruta sea correcta

const registerRoute = (req, res) => {
  const { name, coordinates } = req.body;

  const coordinatesString = JSON.stringify(coordinates);  

  const query = `
    INSERT INTO routes (name, coordinates, active)
    VALUES (?, ?, 1)
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

module.exports = { registerRoute };
