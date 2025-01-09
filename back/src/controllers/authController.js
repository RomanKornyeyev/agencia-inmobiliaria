// src/controllers/authController.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Utilidad para generar un token
const generateToken = (payload, rememberMe) => {
    const expiresIn = rememberMe ? '7d' : '30m';
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Registro de usuario
const register = async (req, res) => {
    const { username, email, password, full_name } = req.body;

    // Validar datos de entrada
    if (!username || !email || !password || !full_name) {
        return res.status(400).json({ message: 'username, email, password, and full_name are required' });
    }

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        const [result] = await db.promise().query(
            'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, full_name, 'user']
        );

        // Responder con éxito
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: result.insertId, username, email, full_name, role: 'user' },
        });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login de usuario
const login = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Buscar al usuario en la base de datos
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generar el token
        const token = generateToken({ id: user.id, username: user.username, role: user.role }, rememberMe);

        // Responder con el token y datos del usuario
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role },
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { register, login };