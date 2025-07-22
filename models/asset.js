
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Asset extends Model {}

Asset.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quickBooksBillId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  transactionDate: { type: DataTypes.DATE,   allowNull: false },
  totalAmount:     { type: DataTypes.DECIMAL, allowNull: false },
  description:     { type: DataTypes.TEXT,    allowNull: false },
  accountRef:      { type: DataTypes.STRING,  allowNull: false },
  accountName:     { type: DataTypes.STRING,  allowNull: false },

  assetType:           { type: DataTypes.STRING },
  depreciationMethod:  { type: DataTypes.STRING },
  salvageValue:        { type: DataTypes.DECIMAL },
  usefulLifeYears:     { type: DataTypes.INTEGER },
  annualDepreciation:  { type: DataTypes.DECIMAL },
  monthlyDepreciation: { type: DataTypes.DECIMAL },

  accumulatedDepreciation: {
    type: DataTypes.DECIMAL,
    defaultValue: 0
  },
  lastDepreciationDate: {
  type: DataTypes.DATE,
  allowNull: true,
},
  status: {
    type: DataTypes.ENUM('imported', 'pending', 'reviewed', 'adjustment', 'posted'),
    defaultValue: 'imported'
  },
  journalEntryId: {
  type: DataTypes.INTEGER,  
  references: {
    model: 'JournalEntries', // 💡 Sequelize uses pluralized table names by default
    key: 'id',
  },
  allowNull: true, // allow null until JE is created
},
   fullyDepreciated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { sequelize, modelName: 'Asset' });


module.exports = Asset;
