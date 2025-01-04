const express = require('express');

const router = express.Router();

const realEstateExamples = [
    {
        id: 1,
        title: 'Beautiful Family House',
        description: 'A beautiful family house with a large garden.',
        price: 500000,
        location: '123 Main St, Springfield, USA'
    },
    {
        id: 2,
        title: 'Modern Apartment',
        description: 'A modern apartment in the city center.',
        price: 300000,
        location: '456 Elm St, Metropolis, USA'
    },
    {
        id: 3,
        title: 'Cozy Cottage',
        description: 'A cozy cottage in the countryside.',
        price: 200000,
        location: '789 Oak St, Smalltown, USA'
    }
];

router.get('/', (req, res) => {
    res.json(realEstateExamples);
});

router.post('/', (req, res) => {
    const newRealEstate = req.body;
    newRealEstate.id = realEstateExamples.length + 1;
    realEstateExamples.push(newRealEstate);
    res.status(201).json(newRealEstate);
});

router.get('/:id', (req, res) => {
    const realEstate = realEstateExamples.find(item => item.id === parseInt(req.params.id));
    if (realEstate) {
        res.json(realEstate);
    } else {
        res.status(404).send('Real estate listing not found');
    }
});

router.put('/:id', (req, res) => {
    const realEstate = realEstateExamples.find(item => item.id === parseInt(req.params.id));
    if (realEstate) {
        Object.assign(realEstate, req.body);
        res.json(realEstate);
    } else {
        res.status(404).send('Real estate listing not found');
    }
});

router.delete('/:id', (req, res) => {
    const index = realEstateExamples.findIndex(item => item.id === parseInt(req.params.id));
    if (index !== -1) {
        realEstateExamples.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Real estate listing not found');
    }
});

router.get('/examples', (req, res) => {
    res.json(realEstateExamples);
});

// Define your routes here
router.get('/', (req, res) => {
    res.send('Get all real estate listings');
});

router.post('/', (req, res) => {
    res.send('Create a new real estate listing');
});

router.get('/:id', (req, res) => {
    res.send(`Get real estate listing with ID ${req.params.id}`);
});

router.put('/:id', (req, res) => {
    res.send(`Update real estate listing with ID ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
    res.send(`Delete real estate listing with ID ${req.params.id}`);
});

module.exports = router;