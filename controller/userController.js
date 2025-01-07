const User = require("../model/userModel");

const createUser = async (req, res) => {
  try {
    const { name, dob, phoneNumber, email, address, password,role,study } = req.body;

    const emailExist = await User.findOne({ email });
    if (emailExist) throw new Error("Email is Already Registered");

    const user = new User({
      name,
      dob,
      phoneNumber,
      email,
      address,
      password,
      role,
      study
    });

    await user.save();

    res.status(201).json({
      status: "success",
      data: user,
      message: "Register sucessfull",
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({ status: "error", data: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let result = await User.comparePassword(email, password);
    const { token } = await User.generateAuthToken(result?._id);

    res.status(200).send({
      status: "success",
      data: {
        token: token,
        result,
        message: "Login sucessfull",
      },
    });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.toString() });
  }
};
module.exports = {
  createUser,
  login,
};
