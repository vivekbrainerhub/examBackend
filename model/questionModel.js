const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
  },
  options: {
    type: [String],
    required: [true, "Options are required"],
    validate: {
      validator: function (array) {
        return array.length >= 2;
      },
      message: "A question must have at least two options.",
    },
  },
  answer: {
    type: Number,
    required: [true, "Answer index is required"],
    validate: {
      validator: function (value) {
        return value >= 0 && value < this.options.length;
      },
      message: "Answer must be a valid index within options.",
    },
  },
  study: {
    type: Number,
    default: 9,
  },
  delete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const question = mongoose.model("question", questionSchema);

module.exports = question;
