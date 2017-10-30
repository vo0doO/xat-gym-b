var jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.test = test;

function test(req, res) {
    var token = req.body.Token;

    var decoded = jwt.verify(token, 'secret');

    console.log(decoded.data) // bar

    res.send({
        Status: true,
        Body: {
            Token: token,
            Decode: decoded.data
        }
    });
}