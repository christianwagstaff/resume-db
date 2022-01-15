const express = require("express");
const router = express.Router();
const passport = require("passport");

const api_controller = require("../controllers/apiController");

// GET All Info
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  api_controller.get_all_info
);

// GET Project List
router.get("/projects", api_controller.get_projects);

// GET About Info
router.get("/about", api_controller.get_about);

// GET Contact Info
router.get("/contact", api_controller.get_contact);

// POST new Project
router.post(
  "/projects",
  passport.authenticate("jwt", { session: false }),
  api_controller.create_project
);

// POST New About
router.post(
  "/about",
  passport.authenticate("jwt", { session: false }),
  api_controller.create_about
);

// POST New Contact
router.post(
  "/contact",
  passport.authenticate("jwt", { session: false }),
  api_controller.create_contact
);

// PUT Edit Project Details
router.put(
  "/projects",
  passport.authenticate("jwt", { session: false }),
  api_controller.edit_project
);

// PUT Edit About Details
router.put(
  "/about",
  passport.authenticate("jwt", { session: false }),
  api_controller.edit_about
);

//PUT Edit Contact Details
router.put(
  "/contact",
  passport.authenticate("jwt", { session: false }),
  api_controller.edit_contact
);

// DELETE Delete Project
router.delete(
  "/projects",
  passport.authenticate("jwt", { session: false }),
  api_controller.delete_project
);

// DELETE About
router.delete(
  "/about",
  passport.authenticate("jwt", { session: false }),
  api_controller.delete_about
);

// DELETE Contact
router.delete(
  "/contact",
  passport.authenticate("jwt", { session: false }),
  api_controller.delete_contact
);

module.exports = router;
