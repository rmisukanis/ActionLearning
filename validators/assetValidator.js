const { body } = require('express-validator');

exports.validateAssetImport = [
    body('quickBooksBillId').notEmpty().withMessage('Bill ID is required'),
    body('transactionDate').isISO8601().withMessage('Invalid date'),
    body('totalAmount').isDecimal().withMessage('Amount must be a decimal'),
    body('description').notEmpty().withMessage('Description is required'),
    body('accountRef').notEmpty().withMessage('Account Ref is required'),
    body('accountName').notEmpty().withMessage('Account Name is required'),
    // assetType, depreciationMethod, salvageValue are optional on import
];

exports.validateAssetUpdate = [
    body('assetType')
        .optional()
        .isString()
        .withMessage('Asset type must be a string'),

    body('depreciationMethod')
        .optional()
        .isString()
        .withMessage('Depreciation method must be a string'),

    body('salvageValue')
        .optional()
        .isDecimal()
        .withMessage('Salvage value must be a decimal'),

    body('totalAmount')
        .optional()
        .isDecimal()
        .withMessage('Total amount must be a decimal'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

    body('status')
        .optional()
        .isIn(['imported', 'pending', 'reviewed', 'adjustment', 'posted'])
        .withMessage('Invalid status value'),

    body('depreciationMethod')
        .optional()
        .isIn(['Straight Line', 'Declining Balance'])
        .withMessage('Depreciation method must be either "Straight Line" or "Declining Balance"'),

    body('usefulLifeYears')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Useful life years must be a positive integer'),


];

exports.validateMarkPosted = [
    body('status')
        .equals('posted')
        .withMessage("Status must be 'posted'"),
];