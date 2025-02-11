var tools = require('../tools/tools.js');
var config = require('../config.json');
var request = require('request');
var express = require('express');
var router = express.Router();

/** /api_call **/
router.get('/', async function (req, res) {
  const sqlQuery = req.query.query;
  if (!sqlQuery) {
    return res.json({ error: 'No SQL query provided.' });
  }

  var token = tools.getToken(req.session);
  if (!token) return res.json({ error: 'Not authorized' });
  if (!req.session.realmId) return res.json({ error: 'No realm ID. QBO calls only work if the accounting scope was passed!' });

  const api_uri = config.api_uri;
  const minorversion = 'minorversion=75';
  const accessToken = token.accessToken;
  const url = `${api_uri}${req.session.realmId}/query?query=${encodeURIComponent(sqlQuery)}&${minorversion}`;

  const requestObj = {
    url: url,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Accept': 'application/json'
    }
  };

  request(requestObj, async function (err, response) {
    try {
      const { err: authError, response: authResponse } = await tools.checkForUnauthorized(req, requestObj, err, response);
      
      if (authError || authResponse.statusCode !== 200) {
        return res.json({ error: authError, statusCode: authResponse.statusCode });
      }
      
      const depositsBody = JSON.parse(authResponse.body);
      const deposits = depositsBody.QueryResponse?.Deposit || [];
      
      console.log('deposits, ', deposits)
      console.log('deposits Line, ', deposits[0].Line[0])

      const depositSummary = deposits.map(deposit => ({
        DepositId: deposit.Id || 0,
        TotalAmount: deposit.TotalAmt || 0,
        TransactionDate: deposit.TxnDate || '1970-12-12',
        PrivateNote: deposit.PrivateNote || 'No',
        DepositToAccountValue: deposit.DepositToAccountRef?.value || 0,
        DepositToAccountName: deposit.DepositToAccountRef?.name || 'No',
        LinkedTxnId: deposit.Line[0]?.LinkedTxn?.[0]?.TxnId || 0,
        LinkedTxnType: deposit.Line[0]?.LinkedTxn?.[0]?.TxnType || No,
        DepositLineId: deposit.Line[0]?.Id || 0,
        DepositLineAmount: deposit.Line[0]?.Amount || 0,
      }));

      console.log('Deposit summary:', depositSummary);
      res.json({ depositSummary });  // Send the summary to the front-end

    } catch (error) {
      console.error('Error during deposit processing:', error);
      res.json({ error: 'Error processing the deposits.' });
    }
  });
});

module.exports = router;
