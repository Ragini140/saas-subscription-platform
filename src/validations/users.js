const { Joi } = require("express-validation");
const { errorMessage } = require("./validation");

const createUser = {
  body: Joi.object({
    email: Joi.string().trim().email().required().messages(errorMessage("Email")),
    name: Joi.string().trim().min(1).optional().messages(errorMessage("Name")),
  }),
};

module.exports = { createUser };
