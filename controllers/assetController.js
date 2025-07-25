// @ts-nocheck

const { Asset } = require('../models');
const { validationResult } = require('express-validator');

function calculateDepreciation({ depreciationMethod, totalAmount, salvageValue, usefulLifeYears, transactionDate }) {
    salvageValue = salvageValue ?? 0;
    usefulLifeYears = usefulLifeYears ?? 5;

    let annualDep = 0;
    let monthlyDep = 0;

    if (depreciationMethod === 'Straight Line') {
        annualDep = (totalAmount - salvageValue) / usefulLifeYears;
        monthlyDep = annualDep / 12;
    } else if (depreciationMethod === 'Declining Balance') {
        const rate = 2 / usefulLifeYears;
        annualDep = totalAmount * rate;
        monthlyDep = annualDep / 12;
    }

    // Get start date from transaction
        const start = new Date(transactionDate);

        // Calculate the final depreciation month (e.g., +48 months if 4 years)
        const totalMonths = usefulLifeYears * 12;
        const lastDepreciationDate = new Date(start.getFullYear(), start.getMonth() + totalMonths - 1, 1);

    return {
        annualDepreciation: annualDep,
        monthlyDepreciation: monthlyDep,
        lastDepreciationDate // 👈 include this
    };
}


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
            salvageValue,
            usefulLifeYears  // optionally accept useful life from front-end
        } = req.body;

        // Prevent duplicate imports
        const existing = await Asset.findOne({ where: { quickBooksBillId } });
        if (existing) {
            return res.status(409).json({ message: 'Asset already exists.' });
        }

        // Calculate depreciation
        const {
            annualDepreciation,
            monthlyDepreciation,
            lastDepreciationDate
            } = calculateDepreciation({
            depreciationMethod,
            totalAmount,
            salvageValue,
            usefulLifeYears,
            transactionDate 
            });

        // Create asset with depreciation info included
        console.log('usefulLifeYears value + type before insert:', usefulLifeYears, typeof usefulLifeYears);
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
            annualDepreciation,
            monthlyDepreciation,
            usefulLifeYears,
            lastDepreciationDate,
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
//const { calculateDepreciation } = require('../utils/depreciation');

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
            status,
            usefulLifeYears // new optional field
        } = req.body;

        // Update fields as necessary
        asset.assetType = assetType ?? asset.assetType;
        asset.depreciationMethod = depreciationMethod ?? asset.depreciationMethod;
        asset.salvageValue = salvageValue ?? asset.salvageValue;
        asset.description = description ?? asset.description;
        asset.totalAmount = totalAmount ?? asset.totalAmount;
        if (status) asset.status = status;

        // Recalculate depreciation if any relevant field changed
        if (depreciationMethod || totalAmount || salvageValue || usefulLifeYears) {
            const { annualDepreciation, monthlyDepreciation } = calculateDepreciation({
                depreciationMethod: asset.depreciationMethod,
                totalAmount: asset.totalAmount,
                salvageValue: asset.salvageValue,
                usefulLifeYears
            });

            asset.annualDepreciation = annualDepreciation;
            asset.monthlyDepreciation = monthlyDepreciation;
        }

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

/**
 * @desc Mark an asset as posted
 * @route PATCH /assets/:id/post
 */
exports.markAssetPosted = async (req, res) => {
    const { id } = req.params;

    try {
        const asset = await Asset.findByPk(id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Update status to 'posted'
        asset.status = 'posted';
        await asset.save();

        res.status(200).json({ message: 'Asset marked as posted.', asset });
    } catch (err) {
        console.error('Error marking asset as posted:', err);
        res.status(500).json({ error: 'Server error while updating asset status.' });
    }
};

const { calculateCurrentMonthDepreciation } = require('../services/assetService');

exports.calculateMonthEndDepreciation = async (req, res) => {
  try {
    const result = await calculateCurrentMonthDepreciation();
    res.json(result);
  } catch (err) {
    console.error('Error calculating month-end depreciation:', err);
    res.status(500).json({ error: 'Server error calculating month-end depreciation.' });
  }
};

const { runAccumulatedDepreciationUpdate } = require('../services/assetService');

/**
 * @desc Updates accumulated depreciation for all assets
 * @route POST /assets/depreciation/update-accumulated
 */
exports.updateAccumulatedDepreciation = async (req, res) => {
  try {
    await runAccumulatedDepreciationUpdate();
    res.status(200).json({ message: 'Accumulated depreciation updated.' });
  } catch (err) {
    console.error('Error updating accumulated depreciation:', err);
    res.status(500).json({ error: 'Server error updating accumulated depreciation.' });
  }
};


/**
 * @desc Get all assets
 * @route GET /assets
 */
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll();
    res.status(200).json(assets);
  } catch (err) {
    console.error('Error fetching all assets:', err);
    res.status(500).json({ error: 'Server error fetching assets.' });
  }
};


/**
 * @desc Get all assets that are fully depreciated
 * @route GET /assets/fully-depreciated
 */