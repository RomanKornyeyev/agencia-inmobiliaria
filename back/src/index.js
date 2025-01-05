// src/index.js
const dotenv = require('dotenv');
dotenv.config(); // Cargar variables de entorno

const app = require('./app'); // Importar la configuración de Express

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});