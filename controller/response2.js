// controllers/quoteController.js
const mongodb = require("../Dbase/connection");
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

// Get all data
const getAllData = async (req, res) => {
    try {
        const response = await mongodb.getDb().db().collection('country_president').find();
        response.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ message: 'An error occurred while fetching quotes.' });
    }
};

// Get a single data by ID
const getSingleData = async (req, res) => {
    const countryId = req.params.id;

    if (!ObjectId.isValid(countryId)) {
        return res.status(400).json({ message: 'Invalid quote ID format.' });
    }

    try {
        const response = await mongodb.getDb().db().collection('country_president').findOne({ _id: new ObjectId(countryId) });

        if (!response) {
            return res.status(404).json({ message: 'Quote not found.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.status(500).json({ message: 'An error occurred while fetching the quote.' });
    }
};

// Create a new data
const createQuote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const response = {
        country: req.body.country,
        continent: req.body.continent,
        currentPresident: req.body.currentPresident,
        potentialPresident: req.body.potentialPresident
    };

    try {
        const result = await mongodb.getDb().db().collection('country_president').insertOne(response);
        if (result.acknowledged) {
            res.status(201).json({ message: 'Data created successfully', id: result.insertedId });
        } else {
            res.status(500).json(result.error || "Some error occurred while creating the quote.");
        }
    } catch (error) {
        console.error('Error creating quote:', error);
        res.status(500).json({ message: 'An error occurred while creating the quote.' });
    }
};

// Update a data
const updateQuote = async (req, res) => {
    const countryId = req.params.id;
    const response = {
        country: req.body.country,
        continent: req.body.continent,
        currentPresident: req.body.currentPresident,
        potentialPresident: req.body.potentialPresident
    };

    try {
        const result = await mongodb.getDb().db().collection('country_president').replaceOne({ _id: new ObjectId(countryId) }, response);
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            res.status(404).json({ message: 'Data not found or no changes made.' });
        }
    } catch (error) {
        console.error('Error updating quote:', error);
        res.status(500).json({ message: 'An error occurred while updating the quote.' });
    }
};

// Delete a data
const deleteQuote = async (req, res) => {
    const countryId = req.params.id;

    try {
        const result = await mongodb.getDb().db().collection('country_president').deleteOne({ _id: new ObjectId(countryId) });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ message: 'Data not found.' });
        }
    } catch (error) {
        console.error('Error deleting quote:', error);
        res.status(500).json({ message: 'An error occurred while deleting the quote.' });
    }
};

module.exports = { getAllData, getSingleData, createQuote, updateQuote, deleteQuote };
