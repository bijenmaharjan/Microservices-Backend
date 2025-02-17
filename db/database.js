const mongoose = require("mongoose");

const connection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("ride service connected to mongodb");
    })
    .catch((err) => {
      console.log("mongodb error: ", err);
    });
};

module.exports = connection;
