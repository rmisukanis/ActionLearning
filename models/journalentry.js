const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class JournalEntry extends Model {}

JournalEntry.init({
  id: {
  type: DataTypes.INTEGER,     
  primaryKey: true,
  autoIncrement: false,      
},
  journalEntryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'JournalEntry'
});

module.exports = JournalEntry;
