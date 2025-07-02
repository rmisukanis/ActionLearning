
const { body } = require('express-validator');

exports.validateAssetImport = [
    body('quickBooksBillId').notEmpty().withMessage('Bill ID is required'),
    body('transactionDate').isISO8601().withMessage('Invalid date'),
    body('totalAmount').isDecimal().withMessage('Amount must be a decimal'),
    body('description').notEmpty().withMessage('Description is required'),
    body('accountRef').notEmpty().withMessage('Account Ref is required'),
    body('accountName').notEmpty().withMessage('Account Name is required'),
    // assetType, depreciationMethod, salvageValue = optional
];