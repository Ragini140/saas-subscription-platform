const { Joi } = require("express-validation");
const { errorMessage } = require("./validation");

const userSubscriptions = {
  params: Joi.object({
    userId: Joi.number().integer().required().messages(errorMessage("User ID")),
  }),
};

module.exports = { userSubscriptions };
