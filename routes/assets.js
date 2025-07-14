var express = require('express');
var router = express.Router();

/** local_call **/
const sampleAssetsTableData = require('../data/assetsTableData');
const sampleDepreciationTableData = require('../data/depreciationTableData');

router.get('/', (req, res) => {

    res.render('assets');
});

//load depreciation table data
router.get('/depreciation', (req, res) => {
    res.json(sampleDepreciationTableData);
});

//update depreciation data to the backend
router.put('/${billId}', (req, res) => {
    // TODO
});

//
router.get('/depreciationEntryJournal', (req, res) => {
    // TODO
});
module.exports = router;