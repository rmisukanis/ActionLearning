const tools = require('../tools/tools');
const config = require('../config.json');
const request = require('request');

exports.postJournalEntry = async (req, res) => {
  console.log('🚀 /api/postJournalEntry controller triggered');

  const input = req.body.journalentry;
  if (!input || !input.TxnDate || !input.Amount) {
    return res.json({ error: 'Missing required fields: TxnDate and Amount.' });
  }

  const constructedBody = {
    TxnDate: input.TxnDate,
    Line: [
      {
        JournalEntryLineDetail: {
          PostingType: "Debit",
          AccountRef: { value: "40" }
        },
        DetailType: input.DetailType || "JournalEntryLineDetail",
        Amount: input.Amount,
        Description: "June Depreciation"
      },
      {
        JournalEntryLineDetail: {
          PostingType: "Credit",
          AccountRef: { value: "39" }
        },
        DetailType: input.DetailType || "JournalEntryLineDetail",
        Amount: input.Amount,
        Description: "June Depreciation"
      }
    ]
  };

  const token = tools.getToken(req.session);
  if (!token) return res.json({ error: 'Not authorized' });
  if (!req.session.realmId) return res.json({ error: 'No realm ID. QBO calls only work if the accounting scope was passed!' });

  const accessToken = token.accessToken;
  const realmId = req.session.realmId;
  const url = `${config.api_uri}${realmId}/journalentry?minorversion=75`;

  const requestOptions = {
    method: 'POST',
    url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(constructedBody)
  };

  console.log('Sending Journal Entry to QBO:', constructedBody);

  request(requestOptions, async (err, response, body) => {
    try {
      const { err: authError, response: authResponse } = await tools.checkForUnauthorized(req, requestOptions, err, response);

      if (authError || authResponse.statusCode !== 200) {
        return res.json({ error: authError, statusCode: authResponse.statusCode });
      }

      const parsedBody = JSON.parse(authResponse.body);
      console.log('✅ Journal Entry response:', parsedBody);
      res.json({ message: 'Journal Entry posted successfully', response: parsedBody });

    } catch (parseError) {
      console.error('Error parsing QuickBooks response:', parseError);
      res.json({ error: 'Error parsing QuickBooks response' });
    }
  });
};
