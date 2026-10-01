const { Router } = require("express");
const { createCheckoutController } = require("../controllers/checkout.controller");
const { validate } = require("../validations/validation");
const { createCheckout } = require("../validations/checkout");

const router = Router();

router.post("/", validate(createCheckout, { context: true }), createCheckoutController);

module.exports = router;
