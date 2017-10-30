var express = require('express');
var router = express.Router();

const libs = require('../libs/signIn')

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log('Method POST "/signin"');

  libs.signIn(req, res);
});

module.exports = router;
