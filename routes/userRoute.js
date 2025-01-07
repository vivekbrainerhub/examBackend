const express = require("express");
const { createUser, login } = require("../controller/userController");


const userRouter = express.Router();

userRouter.post("/create",  createUser);
userRouter.post("/login",  login);

module.exports = userRouter;
