require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL (db_usuarios)'))
  .catch(err => console.error('❌ Error de conexión a BD:', err.stack));

// 1. Obtener todos los usuarios (GET)
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Registrar un nuevo usuario (POST)
app.post('/api/usuarios', async (req, res) => {
  const { nombre, correo, matricula } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, matricula) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, matricula]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor de Usuarios escuchando en http://localhost:${PORT}`);
});