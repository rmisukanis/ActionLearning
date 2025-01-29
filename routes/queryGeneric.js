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
      
      const responseBody = JSON.parse(authResponse.body);
    
      console.log('responseBody:', responseBody);
      res.json({ responseBody });  // Send the summary to the front-end

    } catch (error) {
      console.error('Error during query processing:', error);
      res.json({ error: 'Error processing the query.' });
    }
  });
});

module.exports = router;
