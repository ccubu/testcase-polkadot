const client = require('prom-client');
const polkadotApi = require('../PolkadotApi');
const { failedRequestsCounter } = require("./system.js")

const currentEraGauge = new client.Gauge({
  name: 'polkadot_current_era',
  help: 'Current staking era',
  labelNames: ['chain']
});

const rewardPointsGauge = new client.Gauge({
  name: 'polkadot_eras_reward_points',
  help: 'Eras reward points per validator',
  labelNames: ['chain', 'validator']
});

const validatorsGauge = new client.Gauge({
  name: 'polkadot_validators',
  help: 'List of active validators',
  labelNames: ['validator']
});

const activeValidatorsGauge = new client.Gauge({
  name: 'polkadot_active_validators',
  help: 'Number of active validators',
  labelNames: ['chain']
});

const fetchCurrentEra = async() => {
    try {
        api = polkadotApi.getApi()

      console.log("Fetching Current Era...");
      const rawEra = await Promise.race([
        api.query.staking.currentEra(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching Current Era")), 5000))
      ]);
      const era = rawEra.unwrapOrDefault().toNumber();
      console.log(`Current Era: ${era}`);
      currentEraGauge.labels({ chain: 'polkadot' }).set(era);
      return era;
    } catch (error) {
      console.error("Error fetching Current Era:", error);
      failedRequestsCounter.labels({ endpoint: "currentEra" }).inc();
      return lastMetrics.era || 0;
    }
  }

const fetchRewardPoints = async(era) => {
    try {
      console.log(`Fetching Reward Points for Era ${era}...`);
      api = polkadotApi.getApi()

      const rawRewardPoints = await Promise.race([
        api.query.staking.erasRewardPoints(era),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching Reward Points")), 5000))
      ]);
      const rewardPoints = rawRewardPoints.toJSON();
  
      rewardPointsGauge.reset();
      if (rewardPoints && rewardPoints.individual) {
        for (const [validator, points] of Object.entries(rewardPoints.individual)) {
          rewardPointsGauge.labels({ chain: 'polkadot', validator }).set(points);
        }
      }
      console.log(`Fetched ${Object.keys(rewardPoints.individual).length} reward points.`);
      return rewardPoints.individual;
    } catch (error) {
      console.error("Error fetching Reward Points:", error);
      failedRequestsCounter.labels({ endpoint: "rewardPoints" }).inc();
      return lastMetrics.eras_reward_points || {};
    }
  }

const fetchValidators = async () => {
    try {
      console.log("Fetching Active Validators...");
      api = polkadotApi.getApi()

      const rawValidators = await api.query.session.validators();
      const validators = rawValidators.toJSON();
  
      validatorsGauge.reset();
      if (validators) {
        for (const validator of validators) {
          validatorsGauge.labels({ validator }).set(1);
        }
        activeValidatorsGauge.labels({ chain: 'polkadot' }).set(validators.length);
      }
      console.log(`Active Validators: ${validators.length}`);
      return validators;
    } catch (error) {
      console.error("Error fetching Validators:", error);
      failedRequestsCounter.labels({ endpoint: "validators" }).inc();
      return lastMetrics.validators || [];
    }
  }

  module.exports = {
    fetchCurrentEra,
    fetchRewardPoints,
    fetchValidators
  }