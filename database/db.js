const mongoose = require("mongoose");
const mongoString = "mongodb+srv://vivekanjankc:vivek@cluster0.czyye.mongodb.net";

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoString);
    console.log("Mongoose DB Connected");
  } catch (error) {
    // console.log("Mongoose DB not Connected");
    process.exit(1);
  }
};
