const { body, validationResult } = require("express-validator");

const Project = require("../models/project");

exports.get_projects = (req, res) => {
  Project.find().exec((err, projects) => {
    return res.json({ projects });
  });
};

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
