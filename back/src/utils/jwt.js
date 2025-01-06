const jwt = require('jsonwebtoken');

function generateToken(userId, rememberMe) {
    const expiresIn = rememberMe ? '7d' : '30m';
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };