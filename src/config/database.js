require("dotenv").config();

// Config used by sequelize-cli for migrations.
const config = {
  use_env_variable: "DATABASE_URL",
  dialect: "postgres",
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
