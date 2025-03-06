const client = require('prom-client');
const polkadotApi = require('../PolkadotApi');
const { failedRequestsCounter } = require("./system.js")

const totalTransactionsCounter = new client.Counter({
    name: 'polkadot_total_transactions',
    help: 'Total number of transactions processed in Polkadot',
    labelNames: ['chain']
  });

  
const chainsGauge = new client.Gauge({
    name: 'polkadot_chains',
    help: 'Available chains',
    labelNames: ['chain']
  });

const fetchTotalTransactions = async () => {
    try {
      api = polkadotApi.getApi()
      console.log("Fetching Total Transactions...");
      const rawTxCount = await api.query.system.number();
      const totalTx = rawTxCount.toNumber();
      totalTransactionsCounter.labels({ chain: 'polkadot' }).inc(totalTx);
      console.log(`Total Transactions: ${totalTx}`);
      return totalTx;
    } catch (error) {
      console.error("Error fetching Total Transactions:", error);
      failedRequestsCounter.labels({ endpoint: "totalTransactions" }).inc();
      return 0;
    }
  }

const fetchChains = async () => {
    chainsGauge.labels({ chain: 'polkadot' }).set(1);
  }

module.exports = {
    fetchTotalTransactions,
    fetchChains
}