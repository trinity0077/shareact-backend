require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var racesRouter = require('./routes/races');
var chatsRouter = require('./routes/chats');

var app = express();

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/races', racesRouter);
app.use('/chats', chatsRouter);

module.exports = app;
