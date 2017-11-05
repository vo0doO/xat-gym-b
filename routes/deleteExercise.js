var express = require('express');
var router = express.Router();

const libs = require('../libs/updateProgram')

router.post('/', function(req, res, next) {
  console.log('Method POST "/updateProgram"');

  libs.updateProgram(req, res);
});

module.exports = router;
