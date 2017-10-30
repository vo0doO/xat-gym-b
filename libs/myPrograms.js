const MongoCLient = require('mongodb').MongoClient;

const checkSigIn = require('./checkSignInStatus');
const config = require('../config.json');


module.exports.myPrograms = myPrograms;

function myPrograms(req, res) {
    var token
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: ''
        }
    }

    var token = req.body.Token;
    console.log(';;;;;;;;;;;: ' + token);

    if (token == '') {
        response.Status = false;
        response.Login = false;

        res.send(response);

        return;
    }

    var checkToken = checkSigIn.checkSignInStatusServer(token);
    console.log(JSON.stringify(checkToken));

    if (checkToken.Status == false) {
        response.Status = false;
        response.Login = false

        res.send(response);

        return;
    }

    var login = checkToken.Body.Decode.Email;

    var programs = checkProgramInDB(login);

    if (programs.Status == false) {
        response.Status = false;
        response.Login = true;
        response.Body.Msg = programs.Body.Msg;

        res.send(response);

        return;
    }

    response.Status = true;
    response.Body.Login = login;
    response.Body.Programs = programs.Result;

    return res(response);
}

function checkProgramInDB(login) {
    return new Promise(async done => {
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        var response = {
            Status: false,
            Body: {
                Msg: 'Empty',
                Data: null
            }
        }

        MongoCLient.connect(config.MongoURL, async (err, db) => {
            if (err) {
                console.log('ERROR, libs/myPrograms.js, checkProgramInDB()1: ' + err.message);

                response.Status = false;
                response.Body.Msg = err.message;

                return response;
            } else {
                db.collection('programs').find({
                    Login: login
                }).toArray().then(result => {
                    response.Status = true;
                    response.Body.Result = result;

                    return done(response);
                }).catch(err => {
                    console.log('ERROR, libs/myPrograms.js, checkProgramInDB()2: ' + err.message);

                    response.Status = false;
                    response.Body.Msg = err.message;

                    return done(response);
                })
            }
        });
    });
}