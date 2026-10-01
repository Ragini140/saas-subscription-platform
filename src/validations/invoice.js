const { Joi } = require("express-validation");
const { errorMessage } = require("./validation");

const getInvoice = {
  params: Joi.object({
    // Only allow safe characters since this becomes a file path.
    invoiceNumber: Joi.string()
      .trim()
      .pattern(/^[A-Za-z0-9_-]+$/)
      .required()
      .messages(errorMessage("Invoice Number")),
  }),
};

module.exports = { getInvoice };
