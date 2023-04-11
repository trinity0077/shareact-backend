var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

// Inscription
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "username", "email", "password", "age", "gender"])) {
    console.log(req.body)
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Check if the user has not already been registered
  User.findOne({
    email: { $regex: new RegExp(req.body.email, "i") },
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        email: req.body.email,
        image:req.body.image,
        password: hash,
        age: req.body.age,
        gender: req.body.gender,
        dateCreation: Date.now(),
        token: uid2(32),
      });
      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// Connexion
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } }).then(
    (data) => {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({
          result: true,
          token: data.token,
          firstname: data.firstname,
          username: data.username,
          email: data.email,
          image:data.image,
          age: data.age,
          gender: data.gender,
        });
      } else {
        res.json({ result: false, error: "User not found or wrong password" });
      }
    }
  );
});

module.exports = router;
