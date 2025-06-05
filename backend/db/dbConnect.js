require("dotenv").config(); // load environment variables from .env 
const mongoose = require("mongoose"); 

// connect to MongoDB 
async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;
