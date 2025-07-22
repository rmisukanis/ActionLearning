// routes/assets.js or similar
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.post('/import', assetController.importAsset); // this is the import route

//button used to updated accumulated depreciation
router.post('/depreciation/update-accumulated', assetController.updateAccumulatedDepreciation);

//but to both updated AD and calculate month end depreciation
router.post('/monthly-depreciation', assetController.calculateMonthEndDepreciation);

//next route to send JE to backend

module.exports = router;
