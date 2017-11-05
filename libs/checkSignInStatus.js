const jwt = require('jsonwebtoken');

const config = require('../settings.json');

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

    res.send({
        Status: true,
        Body: {
            Token: token,
            Decode: decoded
        }
    });
}

function checkSignInStatusServer(token) {
    var response = {
        Status: false,
        Body: {
            Token: null,
            Decode: null
        }
    }

    if (token == '' || token == null || token == undefined) {
        return response;
    }

    try {
        var decoded = jwt.verify(token, config.SecretKey);
    } catch (e) {
        console.log('ERROR, /libs/checkSignInStatus/, checkSignInStatusServer()1: ' + e.message);

        response.Status = false;
        response.Body.Msg = e.message;

        return response;
    }

    response.Status = true;
    response.Body.Token = token;
    response.Body.Decode = decoded;

    return response;
}