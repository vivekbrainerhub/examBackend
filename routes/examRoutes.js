const express = require("express");
const {
  submitAnswer,
  startExam,
  getRemainingTime,
} = require("../controller/examController");

const examRouter = express.Router();

examRouter.post("/submit-answer", submitAnswer);
examRouter.post("/start-exam", startExam);
examRouter.post("/left-time", getRemainingTime);

module.exports = examRouter;
