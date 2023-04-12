const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstname: String,
  username: String,
  email: String,
  image: String,
  password: String,
  age: Number,
  gender: String,
  dateCreation: Date,
  followedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  token: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
