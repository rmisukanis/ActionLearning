
var tools = require('../tools/tools.js');
var config = require('../config.json');
var request = require('request');
var express = require('express');
var router = express.Router();

// POST endpoint to process transfer data
router.post('/upload', async function (req, res) {
  console.log('Request body:', req.body);  // Log the body of the request
  const { transfers } = req.body; // Only expect transfers from the client

  // Ensure transfers is provided
  if (!transfers) {
    return res.json({ error: 'Missing required parameter: transfer.' });
  }

  // Get token and realmId from session (similar to queryPayment.js)
  var token = tools.getToken(req.session);
  if (!token) return res.json({ error: 'Not authorized' });
  if (!req.session.realmId) return res.json({ error: 'No realm ID. QBO calls only work if the accounting scope was passed!' });

  const accessToken = token.accessToken;
  const realmId = req.session.realmId;
  console.log('Using Realm ID:', realmId);

  try {
 
    // Function to generate the batch request for QuickBooks
    function generateBatchRequest(transfers) {
      return {
        "BatchItemRequest": transfers.map((transfer, index) => ({
          "bId": `bid${index + 1}`,
          "operation": "create",
          "Transfer": {
            "FromAccountRef": {
              "value": transfer.FromAccountRefValue,
              "name": transfer.FromAccountRefName
            },
            "ToAccountRef": {
              "value": transfer.ToAccountRefValue,
              "name": transfer.ToAccountRefName
            },
            "Amount": transfer.Amount,
            "TxnDate": transfer.TxnDate,
            "PrivateNote": transfer.PrivateNote,
          }
        }))
      };
    }

    // Generate the batch request
    const batchRequest = generateBatchRequest(transfers);

    const api_uri = config.api_uri;
    const realmId = req.session.realmId;
    const session = req.session.realmId;
    const minorversion = 'minorversion=75'
    const accessToken = token.accessToken;

    console.log('api_uri: ', api_uri);
    console.log('realmId: ', realmId);
    console.log('session: ', session);
  
 
    // Setup request options for QuickBooks API
    const options = {
      method: 'POST',
      url: `${api_uri}${realmId}/batch?${minorversion}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}` // Use the access token directly
      },
      body: JSON.stringify(batchRequest)
    };

    console.log('Making API request with options:', options);

    // Make the API request to QuickBooks
    request(options, (error, response, body) => {
      if (error) {
        console.error('Error:', error);
        return res.json({ error: 'Error making request to QuickBooks' });
      } else if (response.statusCode === 200) {
        try {
          const transferBody = JSON.parse(body);
          console.log('Success:', transferBody);
    
          
          if (transferBody.BatchItemResponse) {
            const processedTransfers = transferBody.BatchItemResponse.map(item => {
              const transfer = item.Transfer;
              return { transfer };
            });
            console.log('transfer full: ', processedTransfers)
            // Send the processed transfers as a response
            return res.json({ message: 'transfers processed successfully', processedTransfers });
          } else {
            console.error('No BatchItemResponse found in the response.');
            return res.json({ error: 'No BatchItemResponse found in the response.' });
          }
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          return res.json({ error: 'Error parsing QuickBooks response' });
        }
      } else {
        console.error('Error:', response.statusCode, body);
        return res.json({ error: 'Error with QuickBooks API', statusCode: response.statusCode });
      }
    });

  } catch (error) {
    console.error('Error processing transfer:', error);
    return res.json({ error: 'Error processing transfer' });
  }
});

module.exports = router;
