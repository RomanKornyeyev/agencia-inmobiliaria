// src/app.js
const express = require('express');
const cors = require('cors');
const realState = require('./routes/real-state');
const auth = require('./routes/auth');
const users = require('./routes/users');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.send('Bienvenido a Inmobilix 🏠');
});

app.use('/real-state', realState);
app.use('/auth', auth);
app.use('/users', users);

module.exports = app;
