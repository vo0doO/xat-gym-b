var express = require('express');
var router = express.Router();

const libs = require('../libs/addTraining')

router.post('/', function(req, res, next) {
  console.log('Method POST "/addTraining"');

  libs.addTraining(req, res);
});

module.exports = router;
