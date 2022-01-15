/* eslint-disable no-unused-vars */
const { body, validationResult } = require("express-validator");
const async = require("async");
const bcrypt = require("bcryptjs/dist/bcrypt");

const User = require("../models/user");
const issueJWT = require("../utils/issuejwt");

require("dotenv").config();

// Register New User
exports.register_user = [
  body("username", "Username is Required").trim().isEmail().escape(),
  (req, res, next) => {
    // Only Allow people with the registeration password to create an account
    if (req.body.register_password !== process.env.REGISTER_PASSWORD) {
      return res.status(401).json({ msg: "Registration Password Invalid" });
    }
    User.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (user) {
        return res.json({ success: false, msg: "email is already in use" });
      }
      // No User found, sign them up
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        newUser.save((err, user) => {
          if (err) {
            return next(err);
          }
          const jwt = issueJWT.issueJWT(user);
          return res.json({
            success: true,
            token: jwt.token,
            expiresIn: jwt.expires,
            user,
          });
        });
      });
    });
  },
];
