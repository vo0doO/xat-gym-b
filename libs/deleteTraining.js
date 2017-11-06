const MongoCLient = require('mongodb').MongoClient;
const mongo = require('mongodb')

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.deleteTraining = deleteTraining;

async function deleteTraining(req, res) {
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: ''
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

    console.log('qqq: ' + JSON.stringify(checkToken))

    if (url == '' || url == null || url == undefined) {
        response.Status = false;
        response.Login = true;
        response.Body.Msg = 'Empty url';

        res.send(response);

        return;
    }

    var login = checkToken.Body.Decode.Email;

    var deleteTrainingStatus = await deleteTrainingFromDB(url, login);

    if (deleteTrainingStatus.Status == false) {
        response.Status = false;
        response.Login = true;
        response.Body.Msg = deleteTrainingStatus.Body.Msg;

        res.send(response);

        return;
    }


    response.Status = true;
    response.Login = true;

    res.send(response);

    return;
}

function deleteTrainingFromDB(url, login) {
    console.log('Url: ' + url);
    console.log('Login: ' + login);

    return new Promise(async done => {
        var response = {
            Status: false,
            Body: {
                Msg: 'Empty',
                Data: null
            }
        }

        MongoCLient.connect(config.MongoURL, (err, db) => {
            if (err) {
                console.log('ERROR, libs/deleteProgram.js, deleteProgramFromDB()1: ' + err);

                response.Status = false;
                response.Body.Msg = err.message;

                return done(response);
            } else {
                db.collection('trainings').remove({
                        URL: url,
                        Login: login
                    })
                    .then(() => {
                        response.Status = true;

                        return done(response);
                    })
                    .catch(err => {
                        response.Status = false;
                        response.Body.Msg = err.message;

                        return done(response);
                    });
            }
        })
    });
}