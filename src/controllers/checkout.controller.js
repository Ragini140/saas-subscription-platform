const { createCheckoutSession } = require("../services/checkout.service");

async function createCheckoutController(req, res) {
  try {
    const { userId } = req.body;

    const session = await createCheckoutSession(userId);

    return res.status(201).json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: error.message,
    });
  }
}

module.exports = { createCheckoutController };
