const { body, validationResult } = require("express-validator");

const Project = require("../models/project");
const About = require("../models/about");
const Contact = require("../models/contact");

/**
 * GET Requests
 */

// Sends Projects on GET
exports.get_projects = (req, res, next) => {
  Project.find().exec((err, projects) => {
    if (err) {
      return next(err);
    }
    return res.json({ projects });
  });
};

// Sends About on GET
exports.get_about = (req, res, next) => {
  About.findOne().exec((err, about) => {
    if (err) {
      return next(err);
    }
    return res.json({ about });
  });
};

// Send Contact Info on GET
exports.get_contact = (req, res, next) => {
  Contact.findOne().exec((err, contact) => {
    if (err) {
      return next(err);
    }
    res.json({ contact });
  });
};

/**
 * POST Requests
 */

// Create new project on post
exports.create_project = [
  // If Img is undefined, turn it into an empty string
  (req, res, next) => {
    if (typeof req.body.img === "undefined") {
      req.body.img = "";
    }
    next();
  },
  body("name", "name is required").trim().isLength({ min: 1 }).escape(),
  body("details", "details are required").trim().isLength({ min: 1 }).escape(),
  body("img").escape(),

  // Proceed with request after validation and sanitization
  (req, res, next) => {
    // extract validation errors
    const errors = validationResult(req);
    // Create Project obj with escaped and trimmed data
    let project = new Project({
      user: req.body.user,
      name: req.body.name,
      details: req.body.details,
    });
    if (req.body.img !== "") {
      project.img = req.body.img;
    }

    if (!errors.isEmpty()) {
      // There are validation errors, send back the data for correction
      return res.json({ errors: errors.array(), project });
    }
    // There are no errors, save the new project
    project.save(function (err, saved) {
      if (err) {
        return next(err);
      }
      // Save Successful, send back completed project
      return res.json({ project: saved, msg: "Project Saved" });
    });
  },
];

// Create new About on post
exports.create_about = [
  // Sanitze and Validate Body
  body("name", "name is required").trim().isLength({ min: 1 }).escape(),
  body("about", "details are required").trim().isLength({ min: 1 }).escape(),
  body("headline", "headline is required").trim().isLength({ min: 1 }).escape(),

  // Proceed with request after validation and sanitization
  (req, res, next) => {
    // extract validation errors
    const errors = validationResult(req);
    // Create Project obj with escaped and trimmed data
    let about = new About({
      user: req.body.user,
      name: req.body.name,
      headline: req.body.headline,
      about: req.body.about,
    });
    if (!errors.isEmpty()) {
      // There are validation errors, send back the data for correction
      return res.json({ errors: errors.array(), about });
    }
    // There are no errors, save the new project
    about.save(function (err, saved) {
      if (err) {
        return next(err);
      }
      // Save Successful, send back completed project
      return res.json({ about: saved, msg: "About Saved" });
    });
  },
];

// Create new Contact on POST
exports.create_contact = [
  // Convert the links to an array
  (req, res, next) => {
    if (!(req.body.links instanceof Array)) {
      if (typeof req.body.links === "undefined") {
        req.body.links = [];
      } else {
        req.body.links = new Array(req.body.links);
      }
    }
    next();
  },

  // Sanitze and Validate Body
  body("email", "email is required").trim().isEmail().escape(),
  body("links.*.name").escape(),
  body("links.*.url").escape(),

  // Proceed with request after validation and sanitization
  (req, res, next) => {
    // extract validation errors
    const errors = validationResult(req);
    // Create Project obj with escaped and trimmed data
    let contact = new Contact({
      user: req.body.user,
      email: req.body.email,
      links: req.body.links,
    });
    if (!errors.isEmpty()) {
      // There are validation errors, send back the data for correction
      return res.json({ errors: errors.array(), contact });
    }
    // There are no errors, save the new project
    contact.save(function (err, saved) {
      if (err) {
        return next(err);
      }
      // Save Successful, send back completed project
      return res.json({ contact: saved, msg: "Contact Saved" });
    });
  },
];

/**
 * PUT Requests
 */

// Edit Project
exports.edit_project = [
  // If Img is undefined, turn it into an empty string
  (req, res, next) => {
    if (typeof req.body.img === "undefined") {
      req.body.img = "";
    }
    next();
  },
  body("name", "name is required").trim().isLength({ min: 1 }).escape(),
  body("details", "details are required").trim().isLength({ min: 1 }).escape(),
  body("img").escape(),

  // Proceed with request after validation and sanitization
  (req, res, next) => {
    // extract validation errors
    const errors = validationResult(req);
    // Create Project obj with escaped and trimmed data
    let project = new Project({
      name: req.body.name,
      details: req.body.details,
      _id: req.body.projectId, // Required so a new ID is not issued
    });
    if (req.body.img !== "") {
      project.img = req.body.img;
    }

    if (!errors.isEmpty()) {
      // There are validation errors, send back the data for correction
      return res.json({ errors: errors.array(), project });
    }
    // There are no errors, save the new project
    Project.findByIdAndUpdate(
      req.body.projectId,
      project,
      { new: true },
      function (err, saved) {
        if (err) {
          return next(err);
        }
        // Save Successful, send back completed project
        return res.json({ project: saved, msg: "Project Updated" });
      }
    );
  },
];

/**
 * DELETE Requests
 */

// Delete project by ID
exports.delete_project = (req, res, next) => {
  Project.findByIdAndDelete(req.body.projectId, {}, (err) => {
    if (err) {
      return next(err);
    }
    res.json({ msg: "Project Deleted", project: req.body.projectId });
  });
};
