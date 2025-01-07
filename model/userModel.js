const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      lowercase: true,
      trim: true,
    },
    dob: {
      required: true,
      type: String,
    },
    phoneNumber: {
      required: true,
      type: Number,
    },
    email: {
      required: true,
      type: String,
      lowercase: true,
      trim: true,
    },

    password: {
      required: true,
      type: String,
    },

    address: {
      required: true,
      type: String,
    },
    exam: {
      type: Boolean,
      default: false,
    },
    study:{
      type:Number,
      default:9
    },
    role: {
      type: Number,
      default: 0,
    },
    result: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "result",
    }],
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password only if it's modified
userSchema.pre("save", function (next) {
  const emp = this;

  // Check if the password is being modified or if it's a new document
  if (!emp.isModified("password")) {
    return next(); // Skip hashing if the password isn't modified
  }

  // Hash the password if it's being modified
  bcrypt.hash(emp.password, 10, function (err, hash) {
    if (err) return next(err);
    emp.password = hash; // Set the hashed password
    next(); // Proceed to save the document
  });
});

// Static method to generate authentication token
userSchema.statics.generateAuthToken = async (id) => {
  const user = await User.findOne({ _id: id });
  const token = jwt.sign({ _id: id, user }, process.env.JWTPRIVATEKEY, {
    noTimestamp: true,
    expiresIn: "1m",
  });
  return { token };
};

// Static method to compare password during login
userSchema.statics.comparePassword = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("Invalid Email or Password");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid Email or Password");
  return user;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
