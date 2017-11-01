var express = require('express');
var router = express.Router();

const libs = require('../libs/currentProgram')

router.post('/', function(req, res, next) {
  console.log('Method POST "/currentProgram"');

  libs.currentProgram(req, res);
});

module.exports = router;
