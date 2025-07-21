const { Op } = require('sequelize');
const JournalEntry = require('../models/JournalEntry');

/**
 * Finds the journal entry created in the current month (if any).
 * Returns the journal entry or null.
 */
const findJournalEntryForCurrentMonth = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const entry = await JournalEntry.findOne({
    where: {
      journalEntryDate: {
        [Op.between]: [startOfMonth, endOfMonth],
      }
    },
    order: [['journalEntryDate', 'DESC']],
  });

  return entry;
};

/**
 * Route handler to test the JE lookup for current month
 * GET /journal-entries/current
 */
const getCurrentMonthJournalEntry = async (req, res) => {
  try {
    const je = await findJournalEntryForCurrentMonth();
    if (je) {
      res.json({ found: true, journalEntry: je });
    } else {
      res.json({ found: false, message: 'No journal entry found for current month.' });
    }
  } catch (err) {
    console.error('Error fetching current month journal entry:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = {
  findJournalEntryForCurrentMonth,
  getCurrentMonthJournalEntry
};
