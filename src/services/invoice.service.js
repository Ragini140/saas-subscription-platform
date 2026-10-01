const fs = require("node:fs");
const path = require("node:path");
const PdfPrinter = require("pdfmake/src/printer.js");
const vfs = require("pdfmake/build/vfs_fonts.js").pdfMake.vfs;

const fonts = {
  Roboto: {
    normal: Buffer.from(vfs["Roboto-Regular.ttf"], "base64"),
    bold: Buffer.from(vfs["Roboto-Medium.ttf"], "base64"),
    italics: Buffer.from(vfs["Roboto-Italic.ttf"], "base64"),
    bolditalics: Buffer.from(vfs["Roboto-MediumItalic.ttf"], "base64"),
  },
};

const printer = new PdfPrinter(fonts);

function generateInvoicePdf(data) {
  return new Promise((resolve, reject) => {
    const invoiceDirectory = path.resolve("storage/invoices");
    fs.mkdirSync(invoiceDirectory, { recursive: true });

    const fileName = data.invoiceNumber + ".pdf";
    const filePath = path.join(invoiceDirectory, fileName);

    const amount = (data.amount / 100).toFixed(2) + " " + data.currency.toUpperCase();
    const billingPeriod =
      data.startDate.toLocaleDateString() + " - " + data.endDate.toLocaleDateString();

    const docDefinition = {
      content: [
        { text: "SaaS Platform", fontSize: 24, alignment: "center" },
        { text: "INVOICE", fontSize: 18, alignment: "center", margin: [0, 8, 0, 20] },
        { text: "Invoice Number: " + data.invoiceNumber },
        { text: "Customer: " + data.customerName },
        { text: "Email: " + data.customerEmail, margin: [0, 0, 0, 10] },
        { text: "Plan: " + data.plan },
        { text: "Amount: " + amount },
        { text: "Payment Status: PAID", margin: [0, 0, 0, 10] },
        { text: "Billing Period: " + billingPeriod },
        { text: "Paid At: " + data.paidAt.toLocaleString(), margin: [0, 0, 0, 20] },
        { text: "Thank you for your subscription." },
      ],
      defaultStyle: {
        fontSize: 12,
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const stream = fs.createWriteStream(filePath);

    pdfDoc.pipe(stream);
    pdfDoc.end();

    stream.on("finish", function () {
      resolve("storage/invoices/" + fileName);
    });

    stream.on("error", reject);
  });
}

module.exports = { generateInvoicePdf };
