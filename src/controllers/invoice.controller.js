const fs = require("node:fs");
const path = require("node:path");

function getInvoice(req, res) {
  const { invoiceNumber } = req.params;

  const filePath = path.resolve("storage/invoices", `${invoiceNumber}.pdf`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      message: "Invoice not found",
    });
  }

  return res.sendFile(filePath);
}

module.exports = { getInvoice };
