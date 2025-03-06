const express = require('express');
const compression = require('compression');
const metricsRoutes = require('./routes/metrics');
const statusRoutes = require('./routes/status');

const app = express();

app.use(compression());
app.use(metricsRoutes);
app.use(statusRoutes);

module.exports = app;