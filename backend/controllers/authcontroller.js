const User = require("../models/user"); // Check: use 'user' (lowercase) if your file is user.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Register Logic
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Login Logic
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "your_secret_key",
        { expiresIn: "30d" }
      );
      res.json({ id: user._id, name: user.name, token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Export both - THIS PREVENTS THE ERROR IN ROUTES
module.exports = { registerUser, loginUser };
