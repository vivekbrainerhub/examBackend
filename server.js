require("dotenv").config();
const express = require("express");
const { connectDB } = require("./database/db");

const bodyParser = require("body-parser");
const path = require("path");
var cors = require("cors");
const userRouter = require("./routes/userRoute");
const questionRouter = require("./routes/questionRoute");
const examRouter = require("./routes/examRoutes");

connectDB();

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.get("/", async (req, res) => {
  res.status(200).send("hello");
});
app.use(userRouter);
app.use(questionRouter);
app.use(examRouter);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
module.exports = app;
