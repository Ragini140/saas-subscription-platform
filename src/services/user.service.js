const { User } = require("../models");

async function createUser(input) {
  const existingUser = await User.findOne({ where: { email: input.email } });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    email: input.email,
    name: input.name,
  });

  return user;
}

module.exports = { createUser };
