var tools = require('../tools/tools.js');
var config = require('../config.json');
var request = require('request');
var apiService = require('../service/apiService.js');
var express = require('express');
var router = express.Router();

/** /api_call **/
router.get('/', async function (req, res) {

    var token = tools.getToken(req.session);
    if (!token) return res.json({ error: 'Not authorized' });
    if (!req.session.realmId) return res.json({ error: 'No realm ID. QBO calls only work if the accounting scope was passed!' });
    apiService.getAssets().then(function (data) {
        res.json(data);
    }).catch(function (e) {
        res.json(e);
    });
});

module.exports = router;