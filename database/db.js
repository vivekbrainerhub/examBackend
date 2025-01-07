const mongoose = require("mongoose");
require('dotenv').config()
const mongoString = process.env.DATABASE_URL;

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoString, {
      useNewUrlParser: true,
    });
    console.log("Mongoose DB Connected");
  } catch (error) {
    process.exit(1);
  }
};