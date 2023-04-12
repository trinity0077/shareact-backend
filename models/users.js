const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstname: String,
  alias: String,
  email: String,
  image: String,
  password: String,
  age: Date,
  gender: String,
  dateCreation: Date,
  followedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  token: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
