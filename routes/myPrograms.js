var express = require('express');
var router = express.Router();

const libs = require('../libs/myPrograms')

router.post('/', function(req, res, next) {
  console.log('Method POST "/myPrograms"');

  libs.myPrograms(req, res);
});

module.exports = router;
