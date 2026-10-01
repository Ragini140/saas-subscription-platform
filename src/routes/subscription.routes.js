const { Router } = require("express");
const { getUserSubscriptionsController } = require("../controllers/subscription.controller");
const { validate } = require("../validations/validation");
const { userSubscriptions } = require("../validations/subscription");

const router = Router();

router.get(
  "/user/:userId",
  validate(userSubscriptions, { context: true }),
  getUserSubscriptionsController,
);

module.exports = router;
