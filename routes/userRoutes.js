const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const admin = require("../middleware/adminValidation");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");


router.route("/").get(validateToken, admin, getUsers);
router
  .route("/:id")
  .get(validateToken, getUser)
  .put(validateToken, updateUser)
  .delete(validateToken, deleteUser);

module.exports = router;
