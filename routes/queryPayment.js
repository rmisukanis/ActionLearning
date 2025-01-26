var tools = require('../tools/tools.js')
var config = require('../config.json')
var request = require('request')
var express = require('express')
var router = express.Router()

/** /api_call **/
router.get('/', function (req, res) {
  const sqlQuery = req.query.query;//"select * from Payment Where Id IN ('197','231')"
    if (!sqlQuery) {
      return res.json({ error: 'No SQL query provided.' });
    }

  var token = tools.getToken(req.session)
  if(!token) return res.json({error: 'Not authorized'})
  if(!req.session.realmId) return res.json({
    error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
  })

  // Set up API call (with OAuth2 accessToken)
 
  const api_uri = config.api_uri;
  const realmId = req.session.realmId;
  const session = req.session.realmId;
  const minorversion = 'minorversion=75'
  const accessToken = token.accessToken;



  //const url1 = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(sqlQuery)}&${minorversion}`;
  //var url = config.api_uri + req.session.realmId + '/companyinfo/' + req.session.realmId

  //async function queryPayment(api_uri, realmId, accessToken, sqlQuery = "SELECT * FROM Payment")

  var url = `${api_uri}${realmId}/query?query=${encodeURIComponent(sqlQuery)}&${minorversion}`;
  console.log('Making API call to: ' + url)
  var requestObj = {
    url: url,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Accept': 'application/json'
    }
  }

  // Make API call
  request(requestObj, function (err, response) {
    // Check if 401 response was returned - refresh tokens if so!
    tools.checkForUnauthorized(req, requestObj, err, response).then(function ({err, response}) {
      if(err || response.statusCode != 200) {
        return res.json({error: err, statusCode: response.statusCode})
      }

      const paymentsBody = JSON.parse(response.body)
      console.log('paymentsBody: ',paymentsBody)

      const payments = paymentsBody.QueryResponse?.Payment || [];
      //console.log('payments: ',payments);

      // Summarize Payment data
    ///*
    const paymentSummary = payments.map((payment) => ({
      CustomerName: payment.CustomerRef.name || 'No',
      CustomerId: payment.CustomerRef.value || 0,
      TotalAmount: payment.TotalAmt || 0,
      TransactionDate: payment.TxnDate || '1970-12-12',
      PaymentId: payment.Id || 0,
      DepositToAccountId: payment.DepositToAccountRef?.value || 0,
      UnappliedAmount: payment.UnappliedAmt || 0,
      Currency: payment.CurrencyRef.name || 'No',
      LinkedTxnId: payment.LinkedTxn?.[0]?.TxnId || 0,
      LinkedTxnType: payment.LinkedTxn?.[0]?.TxnType || 'No',
    }));
     // */
      console.log('paymentSummary: ',paymentSummary) //response.body
      // API Call was a success!

      res.json({paymentSummary})
      //res.json(JSON.parse(response.body))


    }, function (err) {
      console.log(err)
      return res.json(err)
    })
  })
})



/** /api_call/revoke **/
router.get('/revoke', function (req, res) {
  var token = tools.getToken(req.session)
  if(!token) return res.json({error: 'Not authorized'})

  var url = tools.revoke_uri
  request({
    url: url,
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + tools.basicAuth,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'token': accessToken
    })
  }, function (err, response, body) {
    if(err || response.statusCode != 200) {
      return res.json({error: err, statusCode: response.statusCode})
    }
    tools.clearToken(req.session)
    res.json({response: "Revoke successful"})
  })
})

/** /api_call/refresh **/
// Note: typical use case would be to refresh the tokens internally (not an API call)
// We recommend refreshing upon receiving a 401 Unauthorized response from Intuit.
// A working example of this can be seen above: `/api_call`
router.get('/refresh', function (req, res) {
  var token = tools.getToken(req.session)
  if(!token) return res.json({error: 'Not authorized'})

  tools.refreshTokens(req.session).then(function(newToken) {
    // We have new tokens!
    res.json({
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken
    })
  }, function(err) {
    // Did we try to call refresh on an old token?
    console.log(err)
    res.json(err)
  })
})

module.exports = router
