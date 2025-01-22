const mongodb = require("../Dbase/connection");
const { ObjectId } = require('mongodb');


// I will be using the database created for this project
// To get all the data from leader_quote collection

const getAllData = async (req, res) => {
    try {
        const response = await mongodb.getDb().db().collection('leaders_quote').find();
        response.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        }); // Await the conversion to an array
       
    } catch (error) {
        console.error('Error fetching contacts:', error); // Log the error for debugging
        res.status(500).json({ message: 'An error occurred while fetching contacts.' });
    }
}

// Get a single quote by ID
const getSingleData = async (req, res) => {

    // swagger.tags = [contacts]
    const quoteId = req.params.id; // Get the ID from the route parameters

    // Validate ObjectId format
    if (!ObjectId.isValid(quoteId)) {
        return res.status(400).json({ message: 'Invalid quote ID format.' });
    }

    try {
        // Use findOne to get a single document
        const response = await mongodb.getDb().db().collection('leaders_quote').findOne({ _id: new ObjectId(quoteId) });

        if (!response) {
            return res.status(404).json({ message: 'Quote not found.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response); // Return the found quote
    } catch (error) {
        console.error('Error fetching quote:', error); // Log the error for debugging
        res.status(500).json({ message: 'An error occurred while fetching the quote.' });
    }
};

module.exports = { getAllData, getSingleData };