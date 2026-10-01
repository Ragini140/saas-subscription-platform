const { Joi } = require("express-validation");
const { errorMessage } = require("./validation");

const createCheckout = {
  body: Joi.object({
    userId: Joi.number().integer().required().messages(errorMessage("User Id")),
  }),
};

module.exports = { createCheckout };
