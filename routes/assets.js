var express = require('express');
var router = express.Router();

/** local_call **/
const sampleAssetsTableData = require('../data/assetsTableData');
const sampleDepreciationTableData = require('../data/depreciationTableData');


/** Back-END Data */
const assetController = require('../controllers/assetController');


router.get('/', (req, res) => {
    res.render('assets');
});

//load depreciation table data
router.get('/GetAllAssets', assetController.getAllAssets);

//update depreciation data to the backend
router.put('/${billId}', (req, res) => {
    // TODO
});

//
router.get('/depreciationEntryJournal', (req, res) => {
    // TODO
});
module.exports = router;