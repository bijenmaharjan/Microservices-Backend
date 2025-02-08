const mongoose = require("mongoose");

const connection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("User service connected to mongodb");
    })
    .catch((err) => {
      console.log("mongodb error: ", err);
    });
};

module.exports = connection;
