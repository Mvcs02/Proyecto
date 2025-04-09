// config/dbconfig.js
const mysql = require('mysql2');

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
  user: 'combisql',
  password: '123456789',
  server: 'localhost',
  database: 'combi2',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: false
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

module.exports = connection;