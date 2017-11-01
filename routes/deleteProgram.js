var express = require('express');
var router = express.Router();

const libs = require('../libs/deleteProgram')

router.post('/', function(req, res, next) {
  console.log('Method POST "/deleteProgram"');

  libs.deleteProgram(req, res);
});

module.exports = router;
