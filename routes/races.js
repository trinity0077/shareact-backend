var express = require('express');
var router = express.Router();

require("../models/connection");
const User = require('../models/users');

const Race = require("../models/races");
const { checkBody } = require("../modules/checkBody");

// GET
router.get('/allRaces', function(req, res) {
    Race.find().then(user => {
      if (user === null) {
        res.json({ result: false, error: 'No races' });
        return;
      }
      Race.find() // Populate and select specific fields to return (for security purposes)
      .populate('author', ['_id'])
      .populate('admin', ['_id', ])
      .populate('participants',['_id','username', 'image'])
      .sort({ createdAt: 'desc' })
        .then(races => {
          res.json({ result: true, races });
        });
    });
  });

// POST
router.post('/', function(req, res) {
  if (!checkBody(req.body, ["author", "admin", "participants", "maxParticipants", "description", "type", "date","address","latitude", "longitude",
  "duration", "distance", "level", "dateCreation" ])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({ _id: '64352b27c1b35d60488ebb77'}).then(user => {  
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }
    const newRace = new Race({  
      author:req.body.author,
      admin:req.body.admin,
      participants:req.body.participants,
      maxParticipants:req.body.maxParticipants,
      description: req.body.description,
      type: req.body.type,
      date: req.body.date,
      address: req.body.address,
      latitude:req.body.latitude,
      longitude:req.body.longitude,
      duration:req.body.duration,
      distance:req.body.distance,
      level:req.body.distance,
      dateCreation: Date.now(),
      //token: req.body.token,
    });
    newRace.save().then(newR => {
      res.json({ result: true, race: newR });
    });
  });
});

// DELETE
router.delete('/', function(req, res) {
  res.render({ result: true });
});

// PUT
router.put('/', function(req, res) {
  res.render({ result: true });
});

module.exports = router;
