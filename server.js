const express = require("express");
const request = require("request-promise");

require("dotenv").config({ path: "./.env.local" });

const app = express(),
  PORT = process.env.PORT || 5500;
