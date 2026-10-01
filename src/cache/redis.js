const { createClient } = require("redis");
const { env } = require("../config/env");

const redis = createClient({
  url: env.redisUrl,
});

redis.on("error", (err) => console.error("Redis Client Error", err));

module.exports = { redis };
