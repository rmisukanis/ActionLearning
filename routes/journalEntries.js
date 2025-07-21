const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const journalEntryController = require('../controllers/journalEntryController');

// GET /journal-entries/current
router.get('/current', assetController.calculateMonthEndDepreciation);

// POST /journal-entries
router.post('/post', journalEntryController.saveJournalEntryToDb);

module.exports = router;
