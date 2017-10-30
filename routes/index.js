var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Method GET "/"');
  console.log('Current login: ', req.session.login)
  res.send('server works');
});

module.exports = router;
