const MongoCLient = require('mongodb').MongoClient;

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');


module.exports.myPrograms = myPrograms;

async function myPrograms(req, res) {
    var token
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: ''
        }
    }

    var token = req.body.Token;

    if (token == '') {
        response.Status = false;
        response.Login = false;

        res.send(response);

        return;
    }

    var checkToken = checkSigIn.checkSignInStatusServer(token);

    if (checkToken.Status == false) {
        response.Status = false;
        response.Login = false

        res.send(response);

        return;
    }

    var login = checkToken.Body.Decode.Email;

    var programs = await checkProgramInDB(login);

    if (programs.Status == false) {
        response.Status = false;
        response.Login = true;
        response.Body.Msg = programs.Body.Msg;

        res.send(response);

        return;
    }

    response.Status = true;
    response.Body.Login = login;
    response.Body.Programs = programs.Body.Result;

    console.log('end');
    console.log('xxx2:' + JSON.stringify(programs.Body.Result));

    res.send(response);
    return;
}

function checkProgramInDB(login) {
    return new Promise(async done => {
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