const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/*
 * @desc Retrieve all users (admin only)
 * @route POST /api/users/
 * @access private | admin
 */

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    message: "All contacts retrieved successfully!",
    status: true,
    users: users,
  });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  // Check if user exists
  if (!user) {
    res.status(404).json({ 
      message: "User not found" 
    });
  }
  // Check if the user is the owner of the account
  if (user._id.toString() !== req.user._id.toString()) {
    res.status(401).json({
      message: "User not authorized to view this profile",
      status: false,
    });
  } else {
    res.status(200).json({
      message: "User retrieved successfully!",
      status: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  // Check if the user exists
  if (!user) {
    try {
      res.status(404);
      throw new Error("User not found");
    } catch (error) {
      return res.status(404).json({ message: "User not found" });
    }
  }

  // Check if the user is the owner of the account
  if (user._id.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({ message: "Not authorized to update this user" });
  }

  // Update the user's information
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin || user.isAdmin;
  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save();

  res.status(200).json(
    {
       message: "User updated successfully",
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
     
      
    }
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  // Check if the user exists
  const user = await User.findById(req.params.id);

  // Check if the user is the owner of the account
  if (user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "Not authorized to delete this user" });
  }
  // Delete the user
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: `Deleted user for id ${req.params.id}`,
    status: true,
    contact: deletedUser,
  });
});

module.exports = { getUsers, getUser, updateUser, deleteUser };
