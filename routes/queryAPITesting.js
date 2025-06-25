const express = require('express');
const router = express.Router();
const tools = require('../tools/tools.js');
const config = require('../config.json');
const request = require('request');

router.get('/', function (req, res) {
  const sqlQuery = "select * from bill where TxnDate >= '2025-06-01'";
  const token = tools.getToken(req.session);

  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  if (!req.session.realmId) {
    return res.status(400).json({ error: 'Missing realm ID' });
  }

  const url = `${config.api_uri}${req.session.realmId}/query?query=${encodeURIComponent(sqlQuery)}&minorversion=75`;

  const requestObj = {
    url: url,
    headers: {
      'Authorization': 'Bearer ' + token.accessToken,
      'Accept': 'application/json'
    }
  };

  request(requestObj, async function (err, response) {
    const { err: authError, response: authResponse } = await tools.checkForUnauthorized(
      req, requestObj, err, response
    );

    if (authError || authResponse.statusCode !== 200) {
      return res.status(500).json({ error: authError || authResponse.body });
    }

    const data = JSON.parse(authResponse.body);
    res.json(data);
  });
});

module.exports = router;
