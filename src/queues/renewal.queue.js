const { Queue } = require("bullmq");
const { Redis } = require("ioredis");
const { env } = require("../config/env");

const connection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
});

const renewalQueue = new Queue("renewal-reminders", {
  connection,
});

module.exports = { renewalQueue };
