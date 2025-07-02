// @ts-nocheck

const { Asset } = require('../models');
const { validationResult } = require('express-validator');

/**
 * @desc Import a new asset (from QuickBooks bill)
 * @route POST /assets
 */
exports.importAsset = async (req, res) => {
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
            salvageValue,
            status: 'pending'  // imported -> pending for review
        });

        res.status(201).json({ message: 'Asset imported successfully.', asset: newAsset });
    } catch (err) {
        console.error('Asset import failed:', err);
        res.status(500).json({ error: 'Server error while importing asset.' });
    }
};

/**
 * @desc Get an asset by ID for review
 * @route GET /assets/:id
 */
exports.getAsset = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found.' });
        }
        res.json(asset);
    } catch (err) {
        console.error('Error fetching asset:', err);
        res.status(500).json({ error: 'Server error fetching asset.' });
    }
};

/**
 * @desc Update asset details (adjustments)
 * @route PUT /assets/:id
 */
exports.updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found.' });
        }

        const {
            assetType,
            depreciationMethod,
            salvageValue,
            description,
            totalAmount,
            status // allow status update here if needed
        } = req.body;

        // Update fields as necessary
        asset.assetType = assetType ?? asset.assetType;
        asset.depreciationMethod = depreciationMethod ?? asset.depreciationMethod;
        asset.salvageValue = salvageValue ?? asset.salvageValue;
        asset.description = description ?? asset.description;
        asset.totalAmount = totalAmount ?? asset.totalAmount;
        if (status) asset.status = status;

        await asset.save();
        res.json({ message: 'Asset updated successfully.', asset });
    } catch (err) {
        console.error('Error updating asset:', err);
        res.status(500).json({ error: 'Server error updating asset.' });
    }
};

/**
 * @desc Approve/post asset (mark as posted)
 * @route POST /assets/:id/approve
 */
exports.approveAsset = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found.' });
        }

        if (asset.status === 'posted') {
            return res.status(400).json({ message: 'Asset already posted.' });
        }

        asset.status = 'posted';
        await asset.save();

        res.json({ message: 'Asset approved and posted successfully.', asset });
    } catch (err) {
        console.error('Error approving asset:', err);
        res.status(500).json({ error: 'Server error approving asset.' });
    }
};

