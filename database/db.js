// const mongoose = require("mongoose");
// const mongoString = "mongodb+srv://vivekanjankc:vivek@cluster0.czyye.mongodb.net";

// exports.connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(mongoString);
//     console.log("Mongoose DB Connected");
//   } catch (error) {
//     // console.log("Mongoose DB not Connected");
//     process.exit(1);
//   }
// };
const mongoose = require('mongoose');

const mongoString = "mongodb+srv://vivekanjankc:vivek@cluster0.czyye.mongodb.net";

exports.connectDB = async () => {
  try {
    // MongoDB connection options
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
    };

    // Establish connection to the MongoDB database
    const conn = await mongoose.connect(mongoString, mongooseOptions);
    console.log("Mongoose DB Connected");
  } catch (error) {
    console.error("Mongoose DB not connected", error.message);
    process.exit(1);  // Exit the process if there's an error
  }
};

// Graceful shutdown for when the app is terminated (useful for Vercel)
process.on('SIGINT', async () => {
  console.log("Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);  // Exit gracefully
});
