// File: services/journalEntryService.js
// Purpose: Business logic — builds the QuickBooks payload using data functions.

const { calculateCurrentMonthDepreciation } = require('./assetService');
const { JournalEntry } = require('../models');
const { Op } = require('sequelize');


// Format date as "YYYY-MM-DD"
function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// Create a description string based on today's date
function formatDescription(date = new Date()) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year} monthly journal entry`;
}

/**
 * Builds the QuickBooks JournalEntry payload dynamically.
 * @param {Object} session — pass user/session info if needed
 * @returns {Promise<Object>} the complete QuickBooks JE JSON
 */
async function buildJournalEntryPayload(session) {
  // 1) Fetch DB record for this month's JE
  const { totalMonthlyDepreciation: amount } = await calculateCurrentMonthDepreciation();
  console.log('🎯 Calculated monthly depreciation:', amount);
  const today = new Date();

  // 2) Assemble the payload
  return {
    TxnDate: formatDate(today),
    Line: [
      {
        JournalEntryLineDetail: { PostingType: "Debit",  AccountRef: { value: "40" } },
        DetailType:           "JournalEntryLineDetail",
        Amount:               amount,
        Description:          formatDescription(today)
      },
      {
        JournalEntryLineDetail: { PostingType: "Credit", AccountRef: { value: "39" } },
        DetailType:            "JournalEntryLineDetail",
        Amount:                amount,
        Description:           formatDescription(today)
      }
    ]
  };
}

async function findJournalEntryForCurrentMonth() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return await JournalEntry.findOne({
    where: {
      journalEntryDate: { [Op.between]: [start, end] }
    },
    order: [['journalEntryDate', 'DESC']],
  });
}


async function handleJournalEntryForCurrentMonth(session) {
  const existingJE = await findJournalEntryForCurrentMonth();

  const { totalMonthlyDepreciation } = await calculateCurrentMonthDepreciation();

  if (existingJE) {
  const payload = await buildJournalEntryPayload(session);
  console.log(`🟡 Existing JE found (ID ${existingJE.id}) – skipping QB post.`);
  console.log(`🧮 Recalculated monthly depreciation: ${totalMonthlyDepreciation}`);

  //verifies the JE table gets upated
  existingJE.changed('updatedAt', true); // Force Sequelize to treat it as changed
  await existingJE.save();
  const refreshed = await JournalEntry.findByPk(existingJE.id);
  console.log('✅ updatedAt after update:', refreshed.updatedAt);
  return {
    reused: true,
    journalEntryId: existingJE.id,
    payload, // include rebuilt payload for logging or preview
  };
}

  // Else: build payload to post to QB
  const payload = await buildJournalEntryPayload(session);
  return { reused: false, payload };
}

module.exports = { buildJournalEntryPayload
  , handleJournalEntryForCurrentMonth 
  , findJournalEntryForCurrentMonth };