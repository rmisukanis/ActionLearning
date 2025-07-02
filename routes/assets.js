var express = require('express');
var router = express.Router();

/** local_call **/
const sampleAssetsTableData = require('../data/assetsTableData');
const sampleDepriciationTableData = require('../data/depriciationTableData');

router.post('/data', (req, res) => {
    const { startDate, endDate, accountFilter } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = sampleAssetsTableData.filter((item) => {
        const itemDate = new Date(item.TransactionDate);
        const matchDate = itemDate >= start && itemDate <= end;

        const matchAccount =
            !accountFilter || accountFilter === 'All Accounts' || item.BillAccountName === accountFilter;

        return matchDate && matchAccount;
    });

    res.json(filtered);
});

router.get('/', (req, res) => {

    res.render('assets');
});

router.get('/depreciation', (req, res) => {
    res.json(sampleDepriciationTableData);
});

module.exports = router;