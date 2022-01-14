const Project = require("../models/project");

exports.get_projects = (req, res) => {
  Project.find().exec((err, projects) => {
    return res.json({ projects });
  });
};
