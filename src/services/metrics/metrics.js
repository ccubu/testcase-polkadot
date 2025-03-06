const { fetchCurrentEra, fetchRewardPoints, fetchValidators } = require("./staking.js");
const { fetchChains, fetchTotalTransactions } = require("./polkadot.js");

let lastMetrics = {};

const fetchMetrics = async () => {
  try {
    const era = await fetchCurrentEra();
    const rewardPoints = await fetchRewardPoints(era);
    const validators = await fetchValidators();
    await fetchTotalTransactions();
    fetchChains();

    lastMetrics = { era, eras_reward_points: rewardPoints, validators };

    console.log("Metrics updated successfully");
  } catch (error) {
    console.error("Error updating metrics:", error);
  }
};

module.exports =  { fetchMetrics, lastMetrics };