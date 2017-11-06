const MongoCLient = require('mongodb').MongoClient;
const randomstring = require("randomstring");

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.getProgram = getProgram;

async function getProgram(req, res) {
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: '666'
        }
    }

    var token = req.body.Token;
    var url = req.body.URL;

    var checkToken = checkSigIn.checkSignInStatusServer(token);

    if (checkToken.Status == false) {
        response.Status = false;
        response.Login = false;
        response.Body.Msg = 'Auth error';

        res.send(response);

        return;
    }

    if (url == '' || url == null || url == undefined) {
        response.Status = false;
        response.Login = true;
        response.Body.Msg = 'Empty url';

        res.send(response);

        return;
    }

    var login = checkToken.Body.Decode.Email;

    console.log('Login: ' + login);
    console.log('Url: ' + url);

    var checkToken = await getProgramFromDB(url, login);

    if (checkToken.Status == false) {
        response.Status = false;
        response.Login = true;
        response.Body.Msg = 'No training';

        res.send(response);

        return;
    }

    response.Status = true;
    response.Login = true;
    response.Body.Result = checkToken.Body.Result;

    res.send(response)
}

function getProgramFromDB(url, login) {
    return new Promise(done => {
        var response = {
            Status: false,
            Body: {
                Msg: 'Empty',
                Data: null
            }
        }

        MongoCLient.connect(config.MongoURL, (err, db) => {
            if (err) {
                console.log('ERROR, libs/currentTraining.js, getProgramFromDB()1: ' + err.message);

                response.Status = false;
                response.Body.Msg = err.message;

                return done(response);
            } else {
                db.collection('trainings').findOne({
                    URL: url,
                    Login: login
                }, (err, result) => {
                    if (err) {
                        console.log('ERROR, libs/currentTraining.js, getProgramFromDB()2: ' + err.message);

                        response.Status = false;
                        response.Body.Msg = err.message;

                        return done(response);
                    } else {
                        if (result == null) {
                            response.Status = false;
                            response.Body.Result = result;
                        } else {
                            response.Status = true;
                            response.Body.Result = result;
                        }

                        return done(response);
                    }
                });
            }
        });
    });
}