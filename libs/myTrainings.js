const MongoCLient = require('mongodb').MongoClient;
const randomstring = require("randomstring");

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.getTrainings = getTrainings;

async function getTrainings(req, res) {
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: ''
        }
    }

    var token = req.body.Token;

    var checkToken = checkSigIn.checkSignInStatusServer(token);

    if (checkToken.Status == false) {
        response.Status = false;
        response.Login = false;
        response.Body.Msg = 'Auth error';

        res.send(response);

        return;
    }

    var login = checkToken.Body.Decode.Email;

    var getProgramsResult = await getProgramsInDB(login);

    if (getProgramsResult.Status == false) {
        response.Status = false;
        response.Login = true;

        response.Body.Msg = getProgramsResult.Body.Msg;

        res.send(response);

        return;
    }

    response.Status = true;
    response.Login = true;

    response.Body.Result = getProgramsResult.Body.Result;

    res.send(response)
}

function getProgramsInDB(login) {
    return new Promise(async done => {
        var response = {
            Status: false,
            Body: {
                Msg: 'Empty',
                Result: null
            }
        }

        MongoCLient.connect(config.MongoURL, async(err, db) => {
            if (err) {
                console.log('ERROR, libs/myTrainings.js, checkProgramInDB()1: ' + err.message);

                response.Status = false;
                response.Body.Msg = err.message;

                return response;
            } else {
                db.collection('trainings').find({
                    Login: login
                }).toArray().then(result => {
                    response.Status = true;
                    response.Body.Result = result;

                    return done(response);
                }).catch(err => {
                    console.log('ERROR, libs/myTrainings.js, checkProgramInDB()2: ' + err.message);

                    response.Status = false;
                    response.Body.Msg = err.message;

                    return done(response);
                })
            }
        });
    });
}