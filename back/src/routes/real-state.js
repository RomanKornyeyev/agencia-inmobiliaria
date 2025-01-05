const express = require('express');
const db = require('../config/db'); // Importar conexión a la BBDD

const router = express.Router();

// 📌 Obtener todos los registros
router.get('/', (req, res) => {
    db.query('SELECT * FROM real_states', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// 📌 Obtener un registro por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM real_states WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json(results[0]);
    });
});

// 📌 Crear un nuevo registro
router.post('/', (req, res) => {
    const { title, description, price, location } = req.body;
    db.query(
        'INSERT INTO real_states (title, description, price, location) VALUES (?, ?, ?, ?)',
        [title, description, price, location],
        (err, results) => {
            if (err) {
                console.error('Error inserting data:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json({ id: results.insertId, title, description, price, location });
        }
    );
});

// 📌 Actualizar un registro por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, price, location } = req.body;
    db.query(
        'UPDATE real_states SET title = ?, description = ?, price = ?, location = ? WHERE id = ?',
        [title, description, price, location, id],
        (err) => {
            if (err) {
                console.error('Error updating data:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: 'Listing updated successfully' });
        }
    );
});

// 📌 Eliminar un registro por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM real_states WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting data:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Listing deleted successfully' });
    });
});

module.exports = router;
