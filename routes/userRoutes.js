const express = require("express");
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const admin = require("../middleware/adminValidation");


router.route("/").get(validateToken, admin, getUsers);

router.route("/:id").get(validateToken, getUser)
.put(validateToken, updateUser)

router.delete("/:id", validateToken, deleteUser );


// router.get("/profile", validateToken, currentUser );

module.exports = router;
