const pool = require('./config/db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar:', err);
  } else {
    console.log('Conexión exitosa. Fecha actual del servidor:', res.rows[0].now);
  }
  pool.end();
});