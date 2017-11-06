var express = require('express');
var router = express.Router();

const libs = require('../libs/deleteTraining')

router.post('/', function(req, res, next) {
  console.log('Method POST "/deleteTraining"');

  libs.deleteTraining(req, res);
});

module.exports = router;
