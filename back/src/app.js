// src/app.js
const express = require('express');
const cors = require('cors');
const realState = require('./routes/real-state');
const db = require('./config/db'); // Conexión a la BBDD

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Para recibir JSON en el body

// Conectar la base de datos
db.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.stack);
        return;
    }
    console.log('✅ Conexión a la base de datos exitosa con ID ' + db.threadId);
});

// Rutas
app.get('/', (req, res) => {
    res.send('Bienvenido a Mobilix, donde hay pisos caros 🏠');
});

app.use('/real-state', realState);

module.exports = app;
