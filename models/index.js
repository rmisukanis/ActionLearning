const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Asset = require('./asset');
const JournalEntry = require('./JournalEntry');
// more models go here
JournalEntry.hasMany(Asset, { foreignKey: 'journalEntryId' });
Asset.belongsTo(JournalEntry, { foreignKey: 'journalEntryId' });

module.exports = {
    sequelize,
    Asset,
    JournalEntry,
};