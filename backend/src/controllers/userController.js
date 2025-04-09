const db = require('../config/dbConfig');

const registerPersona = (req, res) => {
  const {
    id_tipo_persona,
    nombre,
    apellido_pat,
    apellido_mat,
    sexo,
    fecha_nac,
    curp,
    rfc
  } = req.body;

  const query = `
    INSERT INTO personas (
      id_tipo_persona, nombre, apellido_pat, apellido_mat, sexo, fecha_nac, curp, rfc, activo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;

  db.query(
    query,
    [id_tipo_persona, nombre, apellido_pat, apellido_mat, sexo, fecha_nac, curp, rfc],
    (err, results) => {
      if (err) {
        console.error('Error al registrar persona:', err);
        return res.status(500).json({ success: false, message: 'Error al registrar persona' });
      }
      res.status(201).json({ success: true, message: 'Persona registrada exitosamente', id: results.insertId });
    }
  );
};

module.exports = { registerPersona };
