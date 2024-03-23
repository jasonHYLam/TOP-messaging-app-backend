const asyncHandler = require("express-async-handler");

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  console.log("hi hi");
  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: "bad thing happen" });
  } else {
    next();
  }
});

exports.preventIfLoggedIn = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).send({});
  } else {
    next();
  }
});

exports.preventIfLoggedOut = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({});
  } else {
    next();
  }
});
