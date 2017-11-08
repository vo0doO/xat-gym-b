var express = require('express');
var router = express.Router();

const libs = require('../libs/updateTraining')

router.post('/', function(req, res, next) {
  console.log('Method POST "/updateTraining"');

  libs.updateTraining(req, res);
});

module.exports = router;
