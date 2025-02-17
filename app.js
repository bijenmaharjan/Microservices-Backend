const express = require("express");
const app = express();
const connect = require("./db/database");
const captainRoutes = require("./routes/captain-routes");

const cookieParser = require("cookie-parser");

require("dotenv").config();
connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", captainRoutes);

module.exports = app;
