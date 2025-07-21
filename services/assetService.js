// services/assetService.js

const { Asset } = require('../models');
const { Op } = require('sequelize');

async function runAccumulatedDepreciationUpdate() {
  const assets = await Asset.findAll({ where: { fullyDepreciated: false } });
  const now = new Date();

  for (const asset of assets) {
    const txDate = new Date(asset.transactionDate);

    let elapsedMonths =
      (now.getFullYear() - txDate.getFullYear()) * 12 +
      (now.getMonth() - txDate.getMonth()) + 1;

    if (elapsedMonths < 0) elapsedMonths = 0;

    const totalMonths = asset.usefulLifeYears * 12;
    const effectiveMonths = Math.min(elapsedMonths, totalMonths);

    const newAccumulated = effectiveMonths * parseFloat(asset.monthlyDepreciation || 0);
    const fullyDepreciated = effectiveMonths >= totalMonths;

    asset.accumulatedDepreciation = newAccumulated;
    asset.fullyDepreciated = fullyDepreciated;

    await asset.save();
  }
}

async function calculateCurrentMonthDepreciation() {
  await runAccumulatedDepreciationUpdate();

  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const assets = await Asset.findAll({
    where: {
      lastDepreciationDate: {
        [Op.gte]: startOfCurrentMonth,
      },
      fullyDepreciated: false,
    },
  });

  let totalMonthlyDepreciation = 0;
  const perAssetDepreciation = assets.map(asset => {
    const monthly = parseFloat(asset.monthlyDepreciation || 0);
    totalMonthlyDepreciation += monthly;
    return {
      id: asset.id,
      description: asset.description,
      monthlyDepreciation: monthly,
    };
  });

  return {
    totalMonthlyDepreciation: parseFloat(totalMonthlyDepreciation.toFixed(2)),
    perAssetDepreciation,
  };
}

async function updateAssetsWithJournalEntryId(journalEntryId) {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const assets = await Asset.findAll({
    where: {
      lastDepreciationDate: {
        [Op.gte]: startOfCurrentMonth,
      },
      fullyDepreciated: false,
    },
  });

  for (const asset of assets) {
    asset.journalEntryId = journalEntryId;
    await asset.save();
  }

  console.log(`📝 Linked ${assets.length} assets to Journal Entry ID ${journalEntryId}`);
}


module.exports = {
  runAccumulatedDepreciationUpdate,
  calculateCurrentMonthDepreciation,
  updateAssetsWithJournalEntryId,
};
