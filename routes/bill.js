var tools = require('../tools/tools.js');
var config = require('../config.json');
var request = require('request');
var express = require('express');
var router = express.Router();



// GET /bill — render bill form page
router.get('/', (req, res) => {
  res.render('apiTesting'); // will use views/apiTesting.ejs
});


/** /api_call **/
router.get('/queryBill', async function (req, res) {
    console.log('🚀 /bill/queryBill route called');

  const sqlQuery = req.query.query;

  //const sqlQuery = "SELECT * FROM Bill MAXRESULTS 2";
  if (!sqlQuery) {
    return res.json({ error: 'No SQL query provided.' });
  }
  else {
    console.log(sqlQuery)
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
      
      const billsBody = JSON.parse(authResponse.body);
      const bills = billsBody.QueryResponse?.Bill || [];
      
      const billSummary = bills.map(bill => ({


        BillId: bill.Id || 0,
        TransactionDate: bill.TxnDate || '1970-12-12',
        TotalAmount: bill.TotalAmt || 0,
        BillDescription: bill.Line?.[0]?.Description || 'No',
        BillAccount: bill.Line?.[0]?.AccountBasedExpenseLineDetail?.AccountRef?.value || 'Value Error',
        BillAccountName: bill.Line?.[0]?.AccountBasedExpenseLineDetail?.AccountRef?.name || 'Name Error'

      }));

      console.log('Bill summary:', billSummary);
      res.json({ billSummary });  // Send the summary to the front-end

    } catch (error) {
      console.error('Error during bill processing:', error);
      res.json({ error: 'Error processing the bills.' });
    }
  });
});


module.exports = router;
