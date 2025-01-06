const express = require('express');
const { registerUser, loginUser, getProfile, updatePassword } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para login de usuario
router.post('/login', loginUser);

// Ruta para obtener el perfil del usuario
router.get('/profile', verifyToken, getProfile);

// Ruta para actualizar la contraseña del usuario
router.patch('/update-password', verifyToken, updatePassword);

module.exports = router;
