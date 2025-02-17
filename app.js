const express = require("express");
const app = express();
const connect = require("./db/database");
const rideRoutes = require("./routes/ride-routes");

const cookieParser = require("cookie-parser");
const rabbitconnect = require("../ride/services/rabbitconnect");
rabbitconnect.connectRabbitMQ();

require("dotenv").config();
connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", rideRoutes);

module.exports = app;
