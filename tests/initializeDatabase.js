const About = require("../models/about");
const Contact = require("../models/contact");
const Project = require("../models/project");
const User = require("../models/user");

const async = require("async");

const initializeDatabase = async () => {
  let userList = [];
  let projectList = [];
  let contactList = [];
  let aboutList = [];
  function createUser(name, email, password, cb) {
    const userDetails = { name, username: email, password };
    const user = new User(userDetails);
    user.save(function (err) {
      if (err) {
        return cb(err);
      }
      userList.push(user);
      cb(null, user);
    });
  }
  function createAbout(user, name, headline, about, cb) {
    const aboutDetails = { user, name, headline, about };
    const aboutMe = new About(aboutDetails);
    aboutMe.save(function (err) {
      if (err) {
        return cb(err);
      }
      aboutList.push(aboutMe);
      cb(null, aboutMe);
    });
  }
  function createContact(user, email, links, cb) {
    let contactDetails = { user, email };
    if (links != false) {
      contactDetails.links = links;
    }
    const contact = new Contact(contactDetails);
    contact.save(function (err) {
      if (err) {
        return cb(err);
      }
      contactList.push(contact);
      cb(null, contact);
    });
  }
  function createProject(user, name, details, img, cb) {
    let projectDetails = { user, name, details };
    if (img != false) {
      projectDetails.img = img;
    }
    const project = new Project(projectDetails);
    project.save(function (err) {
      if (err) {
        return cb(err);
      }
      projectList.push(project);
      cb(null, project);
    });
  }
  function createUsers(cb) {
    async.series(
      [
        (callback) =>
          createUser("Test User", "Test Email", "Test Password", callback),
      ],
      cb
    );
  }
  function createAbouts(cb) {
    async.series(
      [
        (callback) =>
          createAbout(
            userList[0],
            "Test About Name",
            "Test About Headline",
            "Test About",
            callback
          ),
      ],
      cb
    );
  }
  function createContacts(cb) {
    async.series(
      [
        (callback) =>
          createContact(
            userList[0],
            "test@email.com",
            [{ name: "LinkedIn", url: "linkedin.com" }],
            callback
          ),
      ],
      cb
    );
  }
  function createProjects(cb) {
    async.series(
      [
        (callback) =>
          createProject(
            userList[0],
            "Project 1",
            "Project 1 Details",
            "http://google.com",
            callback
          ),
        (callback) =>
          createProject(
            userList[0],
            "Project 2",
            "Project 2 Details",
            false,
            callback
          ),
      ],
      cb
    );
  }
  await async.series([
    createUsers,
    createAbouts,
    createContacts,
    createProjects,
  ]);
  return [userList, projectList, contactList, aboutList];
};

module.exports = initializeDatabase;
