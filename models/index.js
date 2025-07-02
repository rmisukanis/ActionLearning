const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Asset = require('./asset');
// more models go here

module.exports = {
    sequelize,
    Asset,
};