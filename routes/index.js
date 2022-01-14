const express = require("express");
const router = express.Router();

const api_controller = require("../controllers/apiController");

// GET Project List
router.get("/projects", api_controller.get_projects);

// POSt new Project
router.post("/projects", api_controller.create_project);

module.exports = router;
