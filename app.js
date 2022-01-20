const express = require("express");
const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

require("dotenv").config({ multiline: true });

// Require Route Handles
const indexRoute = require("./routes/index");
const userRoute = require("./routes/users");

const app = express();

app.use(helmet());

// Initialize MongoDB Database
require("./config/mongoDB_production");

// Pass the global passport obj into the config function
require("./config/passport")(passport);

// Initialize passport with each request
app.use(passport.initialize());

// Use Global Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRoute);
app.use("/users", userRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ msg: res.locals.message });
});

module.exports = app;
