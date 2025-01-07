const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  wrongCount: {
    type: Number,
    required: true,
  },
  negativeMarking: {
    type: Number,
    required: true,
  },

  results: [
    {
      question: String,
      correctAnswer: String,
      yourAnswer: String,
      isCorrect: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Result = mongoose.model("result", ResultSchema);

module.exports = Result;
