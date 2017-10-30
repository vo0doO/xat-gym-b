var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Method GET "/test"');

  res.send('server works');
});

module.exports = router;
