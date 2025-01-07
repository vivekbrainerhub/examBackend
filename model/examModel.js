const mongoose = require("mongoose");

const ExamSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  examStartTime: {
    type: Date, // When the exam starts
    required: true,
  },
  examDuration: {
    type: Number, // Duration in minutes
    required: true,
    default: 60, // Default 60 minutes
  },
  isCompleted: {
    type: Boolean, // Mark if the exam is completed
    default: false,
  },
});

const ExamSession = mongoose.model("examSession", ExamSessionSchema);
module.exports = ExamSession;
