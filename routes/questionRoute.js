const express = require("express");
const {
  createQuestion,
  getQuestion,
  deleteQuestion,
  restoreQuestion,
  getByIdQuestion,
  updateQuestion,
  getFilterByClassQuestion,
} = require("../controller/questionController");

const questionRouter = express.Router();

questionRouter.post("/create-question", createQuestion);
questionRouter.get("/all-question", getQuestion);
questionRouter.get("/questions/:id", getByIdQuestion);
questionRouter.delete("/questions/:id", deleteQuestion);
questionRouter.put("/restore/delete/questions/:id", restoreQuestion);
questionRouter.patch("/questions/:id", updateQuestion);
questionRouter.get("/questions/class/:id", getFilterByClassQuestion);
module.exports = questionRouter;
