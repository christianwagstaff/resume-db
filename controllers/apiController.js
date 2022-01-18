const { body, validationResult } = require("express-validator");
const async = require("async");

const Project = require("../models/project");
const About = require("../models/about");
const Contact = require("../models/contact");

/**
 * GET Requests
 */

// GET All Info
exports.get_all_info = (req, res, next) => {
  async.parallel(
    {
      projects: (callback) => Project.find().exec(callback),
      about: (callback) => About.find().exec(callback),
      contact: (callback) => Contact.find().exec(callback),
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success Send Data
      res.json({
        projects: results.projects,
        about: results.about,
        contact: results.contact,
      });
    }
  );
};

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
  Contact.find().exec((err, contact) => {
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
      user: req.user,
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
      user: req.user,
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
  // Sanitze and Validate Body
  body("links.name").trim().isLength({ min: 1 }).escape(),
  body("links.url").isURL().escape(),

  // Proceed with request after validation and sanitization
  (req, res, next) => {
    // extract validation errors
    const errors = validationResult(req);
    // Create Project obj with escaped and trimmed data
    let contact = new Contact({
      user: req.user,
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

// Edit About
exports.edit_about = [
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
      name: req.body.name,
      headline: req.body.headline,
      about: req.body.about,
      _id: req.body.aboutId, // Required so a new id is not issued
    });
    if (!errors.isEmpty()) {
      // There are validation errors, send back the data for correction
      return res.json({ errors: errors.array(), about });
    }
    // There are no errors, save the new project
    About.findByIdAndUpdate(
      req.body.aboutId,
      about,
      { new: true },
      function (err, saved) {
        if (err) {
          return next(err);
        }
        // Save Successful, send back completed project
        return res.json({ about: saved, msg: "About Updated" });
      }
    );
  },
];

// Edit Contact
exports.edit_contact = [
  // Sanitze and Validate Body
  body("links.name").escape(),
  body("links.url").escape(),

  // Proceed with request after validation and sanitization
  (req, res, next) => {
    // extract validation errors
    const errors = validationResult(req);
    // Create Project obj with escaped and trimmed data
    let contact = new Contact({
      user: req.user,
      links: req.body.links,
      _id: req.body.contactId,
    });
    if (!errors.isEmpty()) {
      // There are validation errors, send back the data for correction
      return res.json({ errors: errors.array(), contact });
    }
    // There are no errors, save the new project
    Contact.findByIdAndUpdate(
      req.body.contactId,
      contact,
      { new: true },
      function (err, saved) {
        if (err) {
          return next(err);
        }
        // Save Successful, send back completed project
        return res.json({ contact: saved, msg: "Contact Updated" });
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

// Delete About
exports.delete_about = (req, res, next) => {
  About.findByIdAndDelete(req.body.aboutId, {}, (err) => {
    if (err) {
      return next(err);
    }
    res.json({ msg: "About Deleted", about: req.body.aboutId });
  });
};

// DELETE Contact
exports.delete_contact = (req, res, next) => {
  Contact.findByIdAndDelete(req.body.contactId, {}, (err) => {
    if (err) {
      return next(err);
    }
    res.json({ msg: "Contact Deleted", contact: req.body.contactId });
  });
};
