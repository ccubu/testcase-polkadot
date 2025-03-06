const { lastMetrics } = require('../services/metrics');

exports.getStatus = async (req, res) => {
  res.json({ timestamp: new Date().toISOString(), ...lastMetrics });
};