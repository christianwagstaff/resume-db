const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/usersController");

// Register a new user
// router.post("/login", (req, res, next) => {});

// Register a new user
router.post("/register", user_controller.register_user);

module.exports = router;
