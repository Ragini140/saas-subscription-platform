const { Subscription, Payment } = require("../models");
const { redis } = require("../cache/redis");

const CACHE_KEY = "platform:metrics";
const CACHE_TTL = 180;

async function getPlatformMetrics() {
  const cached = await redis.get(CACHE_KEY);

  if (cached) {
    console.log("Metrics cache HIT");
    return JSON.parse(cached);
  }

  console.log("Metrics cache MISS");

  const activeSubscribers = await Subscription.count({
    where: {
      status: "ACTIVE",
    },
  });

  const revenue = await Payment.sum("amount", {
    where: {
      status: "SUCCEEDED",
    },
  });

  const metrics = {
    activeSubscribers,
    simulatedRevenue: (revenue || 0) / 100,
  };

  await redis.set(CACHE_KEY, JSON.stringify(metrics), {
    EX: CACHE_TTL,
  });

  return metrics;
}

module.exports = { getPlatformMetrics };
