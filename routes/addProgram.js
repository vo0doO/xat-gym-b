var express = require('express');
var router = express.Router();

const libs = require('../libs/addProgram')

router.post('/', function(req, res, next) {
  console.log('Method POST "/addProgram"');

  libs.addProgram(req, res);
});

module.exports = router;
