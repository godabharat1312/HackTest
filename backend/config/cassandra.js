
const cassandra = require("cassandra-driver");
const path = require("path");
require("dotenv").config();

const client = new cassandra.Client({
  cloud: {
    secureConnectBundle: path.join(
      __dirname,
      "../secure-connect-hacktest.zip"
    ),
  },
  credentials: {
    username: "token",
    password: process.env.CASSANDRA_TOKEN,
  },
});

module.exports = client;
