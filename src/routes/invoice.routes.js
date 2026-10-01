const { Router } = require("express");
const { getInvoice: getInvoiceController } = require("../controllers/invoice.controller");
const { validate } = require("../validations/validation");
const { getInvoice } = require("../validations/invoice");

const router = Router();

router.get(
  "/:invoiceNumber",
  validate(getInvoice, { context: true }),
  getInvoiceController,
);

module.exports = router;
