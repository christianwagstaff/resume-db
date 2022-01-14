const express = require("express");
const router = express.Router();

const api_controller = require("../controllers/apiController");

// GET Project List
router.get("/projects", api_controller.get_projects);

// GET About Info
router.get("/about", api_controller.get_about);

// POST new Project
router.post("/projects", api_controller.create_project);

// POST New About
router.post("/about", api_controller.create_about);

module.exports = router;
