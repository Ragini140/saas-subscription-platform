const { Subscription } = require("../models");

async function getUserSubscriptions(userId) {
  return Subscription.findAll({
    where: {
      userId,
    },
    order: [["createdAt", "DESC"]],
  });
}

module.exports = { getUserSubscriptions };
