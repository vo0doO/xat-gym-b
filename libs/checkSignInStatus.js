const jwt = require('jsonwebtoken');

const config = require('../config.json');

module.exports.checkSignInStatus = checkSignInStatus;
module.exports.checkSignInStatusServer = checkSignInStatusServer;

function checkSignInStatus(req, res) {
    var token = req.body.Token;

    try {
        var decoded = jwt.verify(token, config.SecretKey);
    } catch (e) {
        console.log('ERROR, ./libs/chekSignInStatus, checkSignInStatus()1: ' + e.message);

        res.send({
            Status: false,
            Body: {
                Message: e.message
            }
        });

        return;
    }

    console.log('zzz: ' + JSON.stringify(decoded));
    res.send({
        Status: true,
        Body: {
            Token: token,
            Decode: decoded
        }
    })
}

function checkSignInStatusServer(token) {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    try {
        var decoded = jwt.verify(token, config.SecretKey);
    } catch (e) {
        console.log('ERROR, /libs/checkSignInStatus/, checkSignInStatusServer()1: ' + e.message);

        return {
            Status: false,
            Body: {
                Message: e.message
            }
        };

    }
    console.log('xxx: ' + JSON.stringify(decoded.data));

    return {
        Status: true,
        Body: {
            Token: token,
            Decode: decoded
        }
    }
}