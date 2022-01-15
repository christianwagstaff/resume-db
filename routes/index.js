const express = require("express");
const router = express.Router();

const api_controller = require("../controllers/apiController");

// GET All Info
router.get("/", api_controller.get_all_info);

// GET Project List
router.get("/projects", api_controller.get_projects);

// GET About Info
router.get("/about", api_controller.get_about);

// GET Contact Info
router.get("/contact", api_controller.get_contact);

// POST new Project
router.post("/projects", api_controller.create_project);

// POST New About
router.post("/about", api_controller.create_about);

// POST New Contact
router.post("/contact", api_controller.create_contact);

// PUT Edit Project Details
router.put("/projects", api_controller.edit_project);

// PUT Edit About Details
router.put("/about", api_controller.edit_about);

//PUT Edit Contact Details
router.put("/contact", api_controller.edit_contact);

// DELETE Delete Project
router.delete("/projects", api_controller.delete_project);

// DELETE About
router.delete("/about", api_controller.delete_about);

// DELETE Contact
router.delete("/contact", api_controller.delete_contact);

module.exports = router;
