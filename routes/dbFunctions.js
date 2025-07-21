// routes/assets.js or similar
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.post('/import', assetController.importAsset); // this is the import route

router.post('/depreciation/update-accumulated', assetController.updateAccumulatedDepreciation);
router.post('/monthly-depreciation', assetController.calculateMonthEndDepreciation);

module.exports = router;
