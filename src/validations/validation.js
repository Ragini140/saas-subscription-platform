const { validate } = require("express-validation");

// Returns Joi error messages for a field, e.g. errorMessage("Email").
// Pass a custom message as the 2nd arg to override the defaults.
const errorMessage = (data, message = null, min = null, max = null) => {
  return {
    "string.base": message ? `${data} ${message}` : `${data} must be a string.`,
    "string.pattern.base": message ? `${data} ${message}` : `${data} invalid.`,
    "string.empty": message ? `${data} ${message}` : `${data} can't be blank.`,
    "any.required": message ? `${data} ${message}` : `${data} can't be blank.`,
    "string.alphanum": message
      ? `${data} ${message}`
      : `${data} must only contain alpha-numeric characters.`,
    "number.max": message
      ? `${data} ${message}`
      : `${data} must be less than or equal to ${max}.`,
    "number.min": message
      ? `${data} ${message}`
      : `${data} must be greater than or equal to ${min}.`,
    "number.base": message ? `${data} ${message}` : `${data} must be a number.`,
    "array.base": message ? `${data} ${message}` : `${data} must be an array.`,
    "any.only": message ? `${data} ${message}` : `${data} is not included in list.`,
    "array.length": message ? `${data} ${message}` : `${data} must contains items.`,
    "string.email": message ? `${data} ${message}` : `${data} must be valid.`,
    "array.sparse": message
      ? `${data} ${message}`
      : `${data} must not be a sparse array item.`,
    "array.includesRequiredUnknowns": message
      ? `${data} ${message}`
      : `${data} required parameter missing.`,
    "date.greater": message
      ? `${data} ${message}`
      : `${data} must be greater than ${new Date().toISOString()}`,
    "date.max": message ? `${data} ${message}` : `${data} invalid .`,
    "number.integer": message ? `${data} ${message}` : `${data} must be an integer.`,
    "date.base": message ? `${data} ${message}` : `${data} please enter valid date.`,
    "string.max": message
      ? `${data} ${message}`
      : `${data} length must be less than or equal to ${max} characters long.`,
    "string.min": message
      ? `${data} ${message}`
      : `${data} length must be greater than or equal to ${min} characters long.`,
    "string.uri": message ? `${data} ${message}` : `${data} must be a valid url.`,
  };
};

module.exports = { validate, errorMessage };
