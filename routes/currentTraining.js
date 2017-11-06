var express = require('express');
var router = express.Router();

const libs = require('../libs/currentTraining')

router.post('/', function(req, res, next) {
  console.log('Method POST "/currentTraining"');

  libs.getProgram(req, res);
});

module.exports = router;
