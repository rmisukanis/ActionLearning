
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

    // User‐supplied fields:
    assetType:         { type: DataTypes.STRING },   // e.g. “vehicle”
    depreciationMethod:{ type: DataTypes.STRING },   // “straight‐line” etc.
    salvageValue:      { type: DataTypes.DECIMAL },

    status: {
        type: DataTypes.ENUM('imported', 'pending', 'reviewed', 'adjustment', 'posted'),
        defaultValue: 'imported'
    }
}, { sequelize, modelName: 'Asset' });

module.exports = Asset;
