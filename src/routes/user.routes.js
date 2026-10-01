const { Router } = require("express");
const { createUserController } = require("../controllers/user.controller");
const { validate } = require("../validations/validation");
const { createUser } = require("../validations/users");

const router = Router();

router.post("/", validate(createUser, { context: true }), createUserController);

module.exports = router;
