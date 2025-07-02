// @ts-nocheck

const { Asset } = require('../models');
const { validationResult } = require('express-validator');

/**
 * @desc Import a new asset (from QuickBooks bill)
 * @route POST /assets
 */
exports.importAsset = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            quickBooksBillId,
            transactionDate,
            totalAmount,
            description,
            accountRef,
            accountName,
            assetType,
            depreciationMethod,
            salvageValue
        } = req.body;

        // Prevent duplicate imports
        const existing = await Asset.findOne({ where: { quickBooksBillId } });
        if (existing) {
            return res.status(409).json({ message: 'Asset already exists.' });
        }

        // Create asset
        const newAsset = await Asset.create({
            quickBooksBillId,
            transactionDate,
            totalAmount,
            description,
            accountRef,
            accountName,
            assetType,
            depreciationMethod,
            salvageValue
        });

        res.status(201).json({ message: 'Asset imported successfully.', asset: newAsset });
    } catch (err) {
        console.error('Asset import failed:', err);
        res.status(500).json({ error: 'Server error while importing asset.' });
    }
};
