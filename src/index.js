const http = require('http');
const client = require('prom-client');
const polkadotApi = require('./services/PolkadotApi');
const { fetchMetrics } = require('./services/metrics');
const app = require('./app');

const METRICS_REFRESH_INTERVAL = 60000;
const KEEP_ALIVE_TIMEOUT = 75000;
const HEADERS_TIMEOUT = 80000;

client.collectDefaultMetrics();
const PORT = 3000;
let server;

server = http.createServer(app);
server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT;
server.headersTimeout = HEADERS_TIMEOUT;

const interval = setInterval(fetchMetrics, METRICS_REFRESH_INTERVAL);

server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await polkadotApi.init();
  await fetchMetrics();
});

async function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Closing server...`);
  clearInterval(interval);

  if (server) {
    server.close(() => console.log("Express server closed."));
  }

  await polkadotApi.disconnect();

  setTimeout(() => {
    console.log("Force exit.");
    process.exit(0);
  }, 5000);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);