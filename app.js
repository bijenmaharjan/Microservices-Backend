const express = require("express");
const app = express();
const connect = require("./db/database");
const userRoutes = require("./routes/user-routes");

const cookieParser = require("cookie-parser");

require("dotenv").config();
connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRoutes);

module.exports = app;
