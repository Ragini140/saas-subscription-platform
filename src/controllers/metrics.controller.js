const { getPlatformMetrics } = require("../services/metrics.service");

async function getMetrics(_req, res) {
  const metrics = await getPlatformMetrics();

  return res.json(metrics);
}

module.exports = { getMetrics };
