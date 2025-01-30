const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    newUser.save().then(() => {
      res.json({ success: true, message: "User registered successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verification = async (req, res) => {
  try {
    const user = req.user;

    const findUser = await User.findById(user.id);
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      message: "User verified successfully",
      user: findUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUser = (req, res) => {
  try {
    const user = req.user;
    const { name, email, mobile } = req.body;
    const updatedUser = {
      name,
      email,
      mobile,
    };
    User.findByIdAndUpdate(user.id, updatedUser, { new: true })
      .then((updatedUser) => {
        res.json({
          success: true,
          message: "User updated successfully",
          user: updatedUser,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteUser = (req, res) => {
  try {
    const user = req.user;
    User.findByIdAndDelete(user.id)
      .then(() => {
        res.json({ success: true, message: "User deleted successfully" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { login, register, verification, updateUser, deleteUser };
