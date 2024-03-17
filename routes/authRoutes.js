const express = require("express");
const router = express.Router();
const { registerUser, loginUser, currentUser} = require("../controllers/authController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", validateToken, currentUser );

module.exports = router;
