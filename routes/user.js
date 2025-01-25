// routes/quoteRoutes.js
const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const moment = require('moment');
const usercontroller = require("../controller/response");

// Validation rules for creating a quote
const quoteValidationRules = [
    body('name').isString().trim().notEmpty().withMessage('Name is required.'),
    body('born').isString().trim().notEmpty().withMessage('Born date is required.'),
    body('died').isString().trim().optional().custom((value, { req }) => {
        if (value && moment(value).isSameOrBefore(moment(req.body.born))) {
            throw new Error('Died date must be greater than Born date.');
        }
        return true; // Indicates the validation passed
    }),
    body('nationality').isString().trim().notEmpty().withMessage('Nationality is required.'),
    body('quote').isString().trim().notEmpty().withMessage('Quote is required.')
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