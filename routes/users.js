var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

// 3 const en dessou pour la save de la photo
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

// Inscription
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "username", "email", "password", "age", "gender", "image"])) {
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
        age:new Date(req.body.age),
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
      if (data !== null && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({
          result: true,
          token: data.token,
          firstname: data.firstname,
          username: data.username,
        //  email: data.email,
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

//  route pour envoyé l image a cloudinary et recuperer l url de l image en front
router.post('/upload', async (req, res) => {
  let id = uniqid()
const photoPath = `/tmp/${id}.jpg`;
const resultMove = await req.files.photoFromFront.mv(photoPath);

if (!resultMove) {

const resultCloudinary = await cloudinary.uploader.upload(photoPath);

fs.unlinkSync(photoPath);
console.log('teste de  reponse cloudinary',resultCloudinary)
res.json({ result: true, image: resultCloudinary.secure_url });    
} else {
 res.json({ result: false, error: resultMove });
}
});

module.exports = router;
