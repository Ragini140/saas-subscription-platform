const { getUserSubscriptions } = require("../services/subscription.service");

async function getUserSubscriptionsController(req, res) {
  try {
    const userId = Number(req.params.userId);

    const subscriptions = await getUserSubscriptions(userId);

    return res.status(200).json({
      subscriptions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch subscriptions",
    });
  }
}

module.exports = { getUserSubscriptionsController };
