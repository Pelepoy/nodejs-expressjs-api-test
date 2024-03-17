const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

/*
 * @desc Retrieve all users (admin only)
 * @route POST /api/users/
 * @access private | admin
 */

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  const usersData = users.map((user) => {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  });
  res.status(200).json({
    message: "All contacts retrieved successfully!",
    status: true,
    users: usersData,
  });
});

const getUser = asyncHandler(async (req, res) => {
  // Check if user exists
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }
  // Check if the user exists
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
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
  // Check if the user exists
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }
  // Check if the user exists
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
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
  // Save the updated user
  const updatedUser = await user.save();

  res.status(200).json({
    message: "User updated successfully",
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

const deleteUser = asyncHandler(async (req, res) => {

  // Check if the user exists
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }
  // Check if the user exists
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Check if the user is the owner of the account
  if (user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "Not authorized to delete this user | Need admin privilege" });
  }
  // Delete the user
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: `Deleted user for id ${req.params.id}`,
    status: true,
    contact: deletedUser,
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
