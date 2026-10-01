const { Router } = require("express");
const { getMetrics } = require("../controllers/metrics.controller");

const router = Router();

router.get("/", getMetrics);

module.exports = router;
