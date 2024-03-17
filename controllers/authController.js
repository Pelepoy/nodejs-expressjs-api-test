const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/*
 * @desc Register a user
 * @route POST /api/users/register
 * @access public
 */

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body; // Destructuring the request body
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userAvailable = await User.findOne({ email }); // Check if user already exists
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  // Create a new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin,
  });

  // console.log(`User created successfully! ${user}`);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/*
 * @desc Register a user
 * @route POST /api/users/login
 * @access public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // Destructuring the request body
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email }); // Check if user exists
  if (user && (await bcrypt.compare(password, user.password))) {
    // Check if password matches
    const accessToken = jwt.sign(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({
      message: "User logged in successfully",
      accessToken: accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

/*
 * @desc Get user profile
 * @route POST /api/users/profile
 * @access private
 */
const currentUser = asyncHandler(async (req, res) => {
  res.json({
    'user': req.user,
    status: true,
  });
});

module.exports = { registerUser, loginUser, currentUser };
