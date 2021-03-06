var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var jwt = require('jsonwebtoken');

var config = require('./settings.json');

var index = require('./routes/index');
var signIn = require('./routes/signIn');
var checkSignInStatus = require('./routes/checkSignInStatus');
var addProgram = require('./routes/addProgram');
var myPrograms = require('./routes/myPrograms');
var deleteProgram = require('./routes/deleteProgram');
var updateProgram = require('./routes/updateProgram');
var currentProgram = require('./routes/currentProgram');
var addTraining = require('./routes/addTraining');
var currentTraining = require('./routes/currentTraining');
var myTrainings = require('./routes/myTrainings');
var deleteTraining = require('./routes/deleteTraining');
var updateTraining = require('./routes/updateTraining');

var test = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('superSecret', config.SecretKey)
app.set('view engine', 'ejs');

app.use(cors({origin: config.FrontURL}));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

app.use('/', index);

app.use('/api/signin', signIn);
app.use('/api/checksigninstatus', checkSignInStatus);

app.use('/api/addProgram', addProgram);
app.use('/api/myPrograms', myPrograms);
app.use('/api/deleteProgram', deleteProgram);
app.use('/api/program', currentProgram);
app.use('/api/updateProgram', updateProgram);
app.use('/api/addTraining', addTraining);
app.use('/api/training', currentTraining);
app.use('/api/myTrainings', myTrainings);
app.use('/api/deleteTraining', deleteTraining);
app.use('/api/updateTraining', updateTraining);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;