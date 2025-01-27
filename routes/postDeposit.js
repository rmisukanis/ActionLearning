var tools = require('../tools/tools.js');
var config = require('../config.json');
var request = require('request');
var express = require('express');
var router = express.Router();

// POST endpoint to process deposit data
router.post('/upload', async function (req, res) {
  console.log('Request body:', req.body);  // Log the body of the request
  const { deposits } = req.body; // Only expect deposits from the client

  // Ensure deposits is provided
  if (!deposits) {
    return res.json({ error: 'Missing required parameter: deposits.' });
  }

  // Get token and realmId from session (similar to queryPayment.js)
  var token = tools.getToken(req.session);
  if (!token) return res.json({ error: 'Not authorized' });
  if (!req.session.realmId) return res.json({ error: 'No realm ID. QBO calls only work if the accounting scope was passed!' });

  const accessToken = token.accessToken;
  const realmId = req.session.realmId;
  console.log('Using Realm ID:', realmId);

  try {
    // Set minorversion for QuickBooks API
    const minorversion = 'minorversion=75';

    // Function to generate the batch request for QuickBooks
    function generateBatchRequest(deposits) {
      return {
        "BatchItemRequest": deposits.map((deposit, index) => ({
          "bId": `bid${index + 1}`,
          "operation": "create",
          "Deposit": {
            "DepositToAccountRef": {
              "value": deposit.accountValue,
              "name": deposit.accountName
            },
            "TxnDate": deposit.TxnDate,
            "PrivateNote": deposit.PrivateNote,
            "Line": [
              {
                "Amount": deposit.amount,
                "LinkedTxn": [
                  {
                    "TxnId": deposit.txnId,
                    "TxnType": "Invoice",
                    "TxnLineId": "0"
                  }
                ]
              }
            ]
          }
        }))
      };
    }

    // Generate the batch request
    const batchRequest = generateBatchRequest(deposits);

    // Setup request options for QuickBooks API
    const options = {
      method: 'POST',
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/batch?${minorversion}`,
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
          const depositsBody = JSON.parse(body);
          console.log('Success:', depositsBody);

          if (depositsBody.BatchItemResponse) {
            const processedDeposits = depositsBody.BatchItemResponse.map(item => {
              const deposit = item.Deposit;

              // Extract Deposit ID and LinkedTxn information
              const depositId = deposit.Id;
              const linkedTxn = deposit.Line.map(line => line.LinkedTxn).flat(); // Flatten LinkedTxn arrays

              return { depositId, linkedTxn };
            });

            // Log the extracted information
            processedDeposits.forEach((deposit, index) => {
              console.log(`Deposit ${index + 1}:`);
              console.log(`  Deposit ID: ${deposit.depositId}`);
              console.log(`  Linked Transactions:`, deposit.linkedTxn);
            });

            // Send the processed deposits as a response
            return res.json({ message: 'Deposits processed successfully', processedDeposits });
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
    console.error('Error processing deposit:', error);
    return res.json({ error: 'Error processing deposit' });
  }
});

module.exports = router;
