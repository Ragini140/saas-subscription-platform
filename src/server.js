const { app } = require("./app");
const { env } = require("./config/env");
const { sequelize } = require("./models");
const { redis } = require("./cache/redis");
require("./workers/renewal.worker");
const { startRenewalCron } = require("./jobs/renewal.cron");

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");

    await redis.connect();
    console.log("Redis connected");

    startRenewalCron();
    console.log("Renewal cron started");

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
