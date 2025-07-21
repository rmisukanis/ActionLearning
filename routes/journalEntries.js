const express = require('express');
const router = express.Router();
const journalEntryController = require('../controllers/journalEntryController');

// GET /journal-entries/current
router.get('/current', journalEntryController.getCurrentMonthJournalEntry);

module.exports = router;
