require("dotenv").config();

const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { mcpServer } = require("./server");
const { sequelize } = require("../models");
const { redis } = require("../cache/redis");

async function start() {
  await sequelize.authenticate();
  await redis.connect();

  console.error("MCP PostgreSQL connected");
  console.error("MCP Redis connected");

  const transport = new StdioServerTransport();

  await mcpServer.connect(transport);
}

start();
