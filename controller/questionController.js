const Question = require("../model/questionModel");
const User = require("../model/userModel");

const createQuestion = async (req, res) => {
  const { question, options, answer, study } = req.body;

  try {
    const newQuestion = new Question({ question, options, answer, study });
    await newQuestion.save();
    res.status(201).json({
      status: "success",
      data: newQuestion,
      message: "Question created sucessfull",
    });
  } catch (error) {
    res.status(400).json({ message: "Error adding question", error });
  }
};

const getQuestion = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(201).json({
      status: "success",
      data: questions,
      message: "Question Fetch sucessfull",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
};
const getFilterByClassQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.find({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const questions = await Question.find({ study: user[0]?.study });
    res.status(201).json({
      status: "success",
      data: questions,
      message: "Question Fetch sucessfull",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
};
const getByIdQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const questions = await Question.find({ _id: id });
    res.status(201).json({
      status: "success",
      data: questions,
      message: "Question Fetch sucessfull",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
};
const restoreQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndUpdate(
      id,
      { delete: false },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error restoring question", error });
  }
};

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, options, answer, study } = req.body;

  try {
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    existingQuestion.question = question;
    existingQuestion.options = options;
    existingQuestion.answer = answer;
    existingQuestion.study = study;
    await existingQuestion.save();
    res.json({ message: "Question Updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error updating question", error });
  }
};

module.exports = {
  createQuestion,
  getQuestion,
  deleteQuestion,
  restoreQuestion,
  getByIdQuestion,
  updateQuestion,
  getFilterByClassQuestion,
};
