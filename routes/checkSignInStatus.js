var express = require('express');
var router = express.Router();

const libs = require('../libs/checkSignInStatus')

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log('Method GET "/checksigninstatus"');

  libs.checkSignInStatus(req, res);
});

module.exports = router;
