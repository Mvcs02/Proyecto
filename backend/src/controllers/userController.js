const db = require('../config/dbConfig');

const registerUser = (req, res) => {
  const {
    id_tipo_persona,
    nombre,
    apellido_pat,
    apellido_mat,
    sexo,
    fecha_nac,
    curp,
    rfc,
    username,
    password,
    confirmPassword,
  } = req.body;

  // Validación de contraseñas
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden' });
  }

  // Comprobar que el username no exista en la tabla login
  const checkQuery = 'SELECT id_login FROM login WHERE username = ?';
  db.query(checkQuery, [username], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error al verificar username:', checkErr);
      return res.status(500).json({ success: false, message: 'Error al verificar username' });
    }
    if (checkResults.length > 0) {
      return res.status(400).json({ success: false, message: 'El nombre de usuario ya existe' });
    }

    // Insertar en la tabla personas
    const personaQuery = `
      INSERT INTO personas (
        id_tipo_persona, nombre, apellido_pat, apellido_mat, sexo, fecha_nac, curp, rfc, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    db.query(
      personaQuery,
      [id_tipo_persona, nombre, apellido_pat, apellido_mat, sexo, fecha_nac, curp, rfc],
      (personaErr, personaResults) => {
        if (personaErr) {
          console.error('Error al registrar persona:', personaErr);
          return res.status(500).json({ success: false, message: 'Error al registrar persona' });
        }

        // Obtener el id_personas generado al insertar la persona
        const id_personas = personaResults.insertId;

        // Insertar en la tabla login utilizando el id_personas recién creado
        const loginQuery = `
          INSERT INTO login (id_personas, username, password, fecha_creacion)
          VALUES (?, ?, ?, NOW())
        `;
        db.query(
          loginQuery,
          [id_personas, username, password],
          (loginErr, loginResults) => {
            if (loginErr) {
              console.error('Error al registrar login:', loginErr);
              return res.status(500).json({ success: false, message: 'Error al registrar login' });
            }
            res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
          }
        );
      }
    );
  });
};

const checkUsername = (req, res) => {
  const { username } = req.query;
  const query = 'SELECT id_login FROM login WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error al verificar username:', err);
      return res.status(500).json({ exists: false });
    }
    res.status(200).json({ exists: results.length > 0 });
  });
};

module.exports = { registerUser, checkUsername };
