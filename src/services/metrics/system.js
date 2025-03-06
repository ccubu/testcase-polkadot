const client = require('prom-client');


const failedRequestsCounter = new client.Counter({
    name: 'polkadot_failed_requests',
    help: 'Number of failed requests to Polkadot API',
    labelNames: ['endpoint']
  });

failedRequestsCounter.labels({ endpoint: "currentEra" }).inc(0);

module.exports = {
    failedRequestsCounter
}