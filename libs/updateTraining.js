const MongoCLient = require('mongodb').MongoClient;
const randomstring = require("randomstring");

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.updateTraining = updateTraining;

async function updateTraining(req, res) {
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
    var trainingURL = req.body.URL;
    var exercises = req.body.Exercises;
    var finish = req.body.Finish;

    var updateTrainingStatus = await updateTrainingInDB(trainingURL, login, exercises, finish);

    if (updateTrainingStatus == false) {
        response.Status = false;
        response.Login = true;
        response.Body.Msg = programs.Body.Msg;

        res.send(response);

        return;
    }

    response.Status = true;
    response.Login = true;
    response.Body.Msg = 'training updated';

    res.send(response);
}

function updateTrainingInDB(url, login, exercises, finish) {
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
                console.log('ERROR, libs/updateProgram.js, deleteExFromDB()1: ' + err);

                response.Status = false;
                response.Body.Msg = err;

                return response;
            } else {
                var updObj = {}

                console.log('Finish: ' + finish);

                if (finish == true) {
                    updObj.Finished = true;
                    updObj.FinishDate = Date.now();
                } else {
                    updObj.Exercises = exercises
                }

                console.log('updObj: ' + JSON.stringify(updObj));
                db.collection('trainings').findOneAndUpdate({
                    URL: url,
                    Login: login,
                }, {
                    $set: updObj
                }, (err, result) => {
                    if (err) {
                        console.log(err);

                        response.Status = false;
                        response.Body.Msg = err.message;

                        db.close();

                        return done(response);
                    } else {

                        response.Status = true;

                        db.close();

                        return done(response);
                    }
                });
            }
        })
    });
}