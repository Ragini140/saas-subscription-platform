const { createUser } = require("../services/user.service");

async function createUserController(req, res) {
  try {
    const { email, name } = req.body;

    const user = await createUser({ email, name });

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: error.message,
    });
  }
}

module.exports = { createUserController };
