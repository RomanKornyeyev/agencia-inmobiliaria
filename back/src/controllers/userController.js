require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Función para registrar un nuevo usuario
const registerUser = (req, res) => {
    const { username, email, password, full_name, role } = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: 'User with this email already exists' });

        // Hashear la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [username, email, hashedPassword, full_name, role], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const newUser = { id: result.insertId, username, email, full_name, role };
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        });
    });
};

// Función para registrar el login
const loginUser = (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = results[0];
        // Comparar la contraseña con la contraseña hash
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generar el token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },  // Payload
            process.env.JWT_SECRET, // Usamos la clave secreta del archivo .env
            { expiresIn: '1h' } // Opcional: Configura un tiempo de expiración
        );

        res.json({ token });
    });
};


// Función para obtener el perfil
const getProfile = (req, res) => {
    const userId = req.user.id;

    db.query('SELECT id, username, email, full_name, role FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        res.json(user);
    });
};

// Función para actualizar la contraseña
const updatePassword = (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];

        // Verificar si la contraseña actual es válida
        const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);

        if (!isPasswordValid) return res.status(401).json({ message: 'Current password is incorrect' });

        // Hashear la nueva contraseña y actualizarla
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: 'Password updated successfully' });
        });
    });
};

module.exports = { registerUser, loginUser, getProfile, updatePassword };
