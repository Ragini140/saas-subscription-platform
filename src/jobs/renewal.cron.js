const cron = require("node-cron");
const { Op } = require("sequelize");
const { Subscription } = require("../models");
const { renewalQueue } = require("../queues/renewal.queue");

function startRenewalCron() {
  cron.schedule("* * * * *", async () => {
    console.log("Checking expiring subscriptions...");

    const now = new Date();

    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const subscriptions = await Subscription.findAll({
      where: {
        status: "ACTIVE",
        endDate: {
          [Op.gte]: now,
          [Op.lte]: threeDaysLater,
        },
      },
    });

    for (const subscription of subscriptions) {
      await renewalQueue.add(
        "renewal-reminder",
        {
          subscriptionId: subscription.id,
        },
        {
          jobId: `renewal-${subscription.id}`,
        },
      );
    }

    console.log(`Found ${subscriptions.length} expiring subscription(s)`);
  });
}

module.exports = { startRenewalCron };
