const { JournalEntry } = require('../models');

exports.saveJournalEntryToDb = async (req, res) => {
  const { Id, txnDate } = req.body;

  try {
    const journalEntry = await JournalEntry.create({
      id: parseInt(Id),
      journalEntryDate: new Date(txnDate),
    });

    res.status(201).json({ message: 'Journal entry saved.', journalEntry });
  } catch (err) {
    console.error('Error saving journal entry:', err);
    res.status(500).json({ error: 'Failed to save journal entry.' });
  }
};
