var express = require('express');
var router = express.Router();

const libs = require('../libs/myTrainings')

router.post('/', function(req, res, next) {
  console.log('Method POST "/myTrainings"');

  libs.getTrainings(req, res);
});

module.exports = router;
