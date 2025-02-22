// controllers/quoteController.js
const mongodb = require("../Dbase/connection");
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

// Get all quotes
const getAllData = async (req, res) => {
    try {
        const response = await mongodb.getDb().db().collection('leaders_quote').find();
        response.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ message: 'An error occurred while fetching quotes.' });
    }
};

// Get a single quote by ID
const getSingleData = async (req, res) => {
    const quoteId = req.params.id;

    if (!ObjectId.isValid(quoteId)) {
        return res.status(400).json({ message: 'Invalid quote ID format.' });
    }

    try {
        const response = await mongodb.getDb().db().collection('leaders_quote').findOne({ _id: new ObjectId(quoteId) });

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

// Create a new quote
const createQuote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const quote = {
        name: req.body.name,
        born: req.body.born,
        died: req.body.died,
        nationality: req.body.nationality,
        quote: req.body.quote
    };

    try {
        const result = await mongodb.getDb().db().collection('leaders_quote').insertOne(quote);
        if (result.acknowledged) {
            res.status(201).json({ message: 'Quote created successfully', id: result.insertedId });
        } else {
            res.status(500).json(result.error || "Some error occurred while creating the quote.");
        }
    } catch (error) {
        console.error('Error creating quote:', error);
        res.status(500).json({ message: 'An error occurred while creating the quote.' });
    }
};

// Update a quote
const updateQuote = async (req, res) => {
    const quoteId = req.params.id;
    const quote = {
        name: req.body.name,
        born: req.body.born,
        died: req.body.died,
        nationality: req.body.nationality,
        quote: req.body.quote
    };

    try {
        const result = await mongodb.getDb().db().collection('leaders_quote').replaceOne({ _id: new ObjectId(quoteId) }, quote);
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Quote updated successfully' });
        } else {
            res.status(404).json({ message: 'Quote not found or no changes made.' });
        }
    } catch (error) {
        console.error('Error updating quote:', error);
        res.status(500).json({ message: 'An error occurred while updating the quote.' });
    }
};

// Delete a quote
const deleteQuote = async (req, res) => {
    const quoteId = req.params.id;

    try {
        const result = await mongodb.getDb().db().collection('leaders_quote').deleteOne({ _id: new ObjectId(quoteId) });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Quote deleted successfully' });
        } else {
            res.status(404).json({ message: 'Quote not found.' });
        }
    } catch (error) {
        console.error('Error deleting quote:', error);
        res.status(500).json({ message: 'An error occurred while deleting the quote.' });
    }
};

module.exports = { getAllData, getSingleData, createQuote, updateQuote, deleteQuote };
