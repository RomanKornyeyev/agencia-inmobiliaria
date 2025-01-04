const express = require('express');
const cors = require("cors");
const realState = require('./routes/real-state');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Bienvenido a mobilix donde hay pisos caros');
}
);

app.use('/real-state', realState);

app.listen(port, () => {
    console.log(`Escuchando manito, por el puerto http://localhost:${port}`);
});