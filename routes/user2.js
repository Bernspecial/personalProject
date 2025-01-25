// routes/quoteRoutes.js
const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

const usercontroller = require("../controller/response2");

// Validation rules for creating a quote
const quoteValidationRules = [
    body('country').isString().trim().notEmpty().withMessage('Country name is required.'),
    body('continent').isString().trim().notEmpty().withMessage('Continent name is required.'),
    body('currentPresident').isString().trim().notEmpty().withMessage("Current President name is required"),
    body('potentialPresident').isString().trim().notEmpty().withMessage('Potential President name is required.'),
];

// Validation rules for updating a quote
const updateQuoteValidationRules = [
    param('id').isMongoId().withMessage('Invalid quote ID format.'),
    ...quoteValidationRules // Reuse the same validation rules for the update
];

// Routes
router.get("/", usercontroller.getAllData); // Get all quotes

router.get("/:id", [
    param('id').isMongoId().withMessage('Invalid quote ID format.')
], usercontroller.getSingleData); // Get a single quote by ID

router.post("/", quoteValidationRules, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, usercontroller.createQuote); // Create a new quote

router.put("/:id", updateQuoteValidationRules, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, usercontroller.updateQuote); // Update a quote

router.delete("/:id", [
    param('id').isMongoId().withMessage('Invalid quote ID format.')
], usercontroller.deleteQuote); // Delete a quote

module.exports = router;