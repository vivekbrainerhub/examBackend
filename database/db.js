const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoString);
    console.log("Mongoose DB Connected");
  } catch (error) {
    console.log("Mongoose DB not Connected");
    // process.exit(1);
  }
};
