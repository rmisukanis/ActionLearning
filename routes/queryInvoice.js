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
      
      const invoicesBody = JSON.parse(authResponse.body);
      const invoices = invoicesBody.QueryResponse?.Invoice || [];
      
      const invoiceSummary = invoices.map(invoice => ({
        InvoiceId: invoice.Id || 0,
        CustomerName: invoice.CustomerRef.name || 'No',
        CustomerId: invoice.CustomerRef.value || 0,
        TotalAmount: invoice.TotalAmt || 0,
        TransactionDate: invoice.TxnDate || '1970-12-12',
        Balance: invoice.Balance || 0,
        LinkedTxnId: invoice.LinkedTxn?.[0]?.TxnId || 0,
        LinkedTxnType: invoice.LinkedTxn?.[0]?.TxnType || 'No',
        InvoiceDocNum: invoice.DocNumber || 0,
        DueDate: invoice.DueDate || '1970-12-12',   
      }));

      console.log('Invoice summary:', invoiceSummary);
      res.json({ invoiceSummary });  // Send the summary to the front-end

    } catch (error) {
      console.error('Error during invoice processing:', error);
      res.json({ error: 'Error processing the invoices.' });
    }
  });
});

module.exports = router;
