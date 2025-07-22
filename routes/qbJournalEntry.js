const express = require('express');
const router = express.Router();
const journalEntryController = require('../controllers/qbJournalEntryController');

router.post('/postJournalEntry', journalEntryController.postJournalEntry);

module.exports = router;
