// File: controllers/qbJournalEntryController.js
// Purpose: HTTP controller — handles Express route, auth, calls service, posts to QuickBooks.

const tools = require('../tools/tools');
const config = require('../config.json');
const request = require('request');
const { handleJournalEntryForCurrentMonth } = require('../services/journalEntryService');
const { updateAssetsWithJournalEntryId } = require('../services/assetService');
const { JournalEntry } = require('../models');

exports.postJournalEntry = async (req, res) => {
  console.log('🚀 /api/postJournalEntry controller triggered');

  const token = tools.getToken(req.session);
  if (!token) return res.json({ error: 'Not authorized' });
  if (!req.session.realmId) return res.json({ error: 'No realm ID.' });

  let result;
  try {
    result = await handleJournalEntryForCurrentMonth(req.session);
  } catch (err) {
    console.error('❌ Failed to prepare JE:', err);
    return res.status(500).json({ error: 'Error preparing journal entry.' });
  }

  const baseUrl = `${config.api_uri}${req.session.realmId}/journalentry?minorversion=75`;

  if (result.reused) {
    const journalEntryId = result.journalEntryId;

    // 🔄 Step 1: Get the existing JE from QuickBooks to get the SyncToken
    const getOptions = {
      method: 'GET',
      url: `${config.api_uri}${req.session.realmId}/journalentry/${journalEntryId}?minorversion=75`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token.accessToken}`,
      },
    };

    request(getOptions, async (err, qbRes) => {
      if (err || qbRes.statusCode !== 200) {
        console.error('❌ Failed to fetch JE for update:', err || qbRes.body);
        return res.status(500).json({ error: 'Failed to fetch journal entry for update.' });
      }

      const qbData = JSON.parse(qbRes.body);
      const syncToken = qbData.JournalEntry?.SyncToken;

      if (!syncToken) {
        return res.status(500).json({ error: 'SyncToken missing from QuickBooks response.' });
      }

      // 🛠 Step 2: Build update payload
      const updatePayload = {
        sparse: true,
        Id: String(journalEntryId),
        SyncToken: syncToken,
        TxnDate: result.payload.TxnDate,
        Line: result.payload.Line,
      };

      // 🔁 Step 3: Post update to QuickBooks
      const postOptions = {
        method: 'POST',
        url: baseUrl,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify(updatePayload),
      };

      request(postOptions, async (err2, updateRes) => {
        if (err2 || updateRes.statusCode !== 200) {
          console.error('❌ Failed to update JE in QuickBooks:', err2 || updateRes.body);
          return res.status(500).json({ error: 'Failed to update journal entry in QuickBooks.' });
        }

        const parsed = JSON.parse(updateRes.body);
        console.log(`🔄 JE ${journalEntryId} updated in QB`, parsed);

        // ✅ Update asset records with the reused JE ID
      await updateAssetsWithJournalEntryId(journalEntryId);
      console.log(`🔗 Updated assets with JE ID ${journalEntryId}`);

        res.status(200).json({
          message: `Journal Entry ${journalEntryId} updated successfully in QuickBooks.`,
          response: parsed,
        });
      });
    });

    return;
  }

  // 🆕 New JE path
  const postOptions = {
    method: 'POST',
    url: baseUrl,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(result.payload),
  };

  request(postOptions, async (err, response) => {
    try {
      const { err: authErr, response: authRes } =
        await tools.checkForUnauthorized(req, postOptions, err, response);

      if (authErr || authRes.statusCode !== 200) {
        console.error('❌ QuickBooks returned an error', {
          statusCode: authRes?.statusCode,
          responseBody: authRes?.body,
          error: authErr,
        });
        return res.json({ error: authErr || 'Non-200 status', statusCode: authRes?.statusCode });
      }

      const parsed = JSON.parse(authRes.body);
      console.log('✅ Journal Entry created in QB:', parsed);

      const qbId = parseInt(parsed.JournalEntry?.Id);
      const txnDate = new Date(parsed.JournalEntry?.TxnDate);

      if (qbId && txnDate) {
        await JournalEntry.create({
          id: qbId,
          journalEntryDate: txnDate,
        });
        console.log(`🗃️ Saved journal entry ${qbId} to local DB`);
        await updateAssetsWithJournalEntryId(qbId);
      } else {
        console.warn('⚠️ Missing JournalEntry Id or TxnDate in QB response.');
      }

      res.json({
        message: 'Journal Entry posted successfully and saved to DB.',
        response: parsed,
      });

    } catch (parseError) {
      console.error('Error parsing QB response:', parseError);
      res.json({ error: 'Error parsing QuickBooks response' });
    }
  });
};
