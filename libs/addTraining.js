const MongoCLient = require('mongodb').MongoClient;
const randomstring = require("randomstring");

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.addTraining = addTraining;

async function addTraining(req, res) {
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: '666'
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

    var training = req.body.Training;

    var programName = training.Name;
    var login = training.Login;
    var exercises = training.Exercises;
    var programUrl = training.Url

    var addedStatus = await addTrainingToDB(programName, programUrl, exercises, login);


    if (addedStatus.Status == false) {
        response.Status = false;
        response.Login = false;
        response.Body.Msg = addedStatus.Body.Msg;

        res.send(response);

        return;
    }

    response.Status = true;
    response.Login = true;
    response.Body.TrainingID = addedStatus.Body.TrainingID

    res.send(response);
}

function addTrainingToDB(programName, programUrl, exercises, login) {
    return new Promise(done => {
        var response = {
            Status: false,
            Body: {
                Msg: 'Empty',
                Data: null
            }
        }

        var trainingUrl = randomstring.generate(10);

        MongoCLient.connect(config.MongoURL, async(err, db) => {
            if (err) {
                console.log('ERROR, libs/addTraining.js, addTrainingToDB()1: ' + err.message);

                response.Status = false;
                response.Body.Msg = err.message;

                return done(response);
            } else {
                db.collection('trainings').insert({
                    URL: trainingUrl,
                    ProgramName: programName,
                    ProgramUrl: programUrl,
                    Login: login,
                    StartDate: Date.now(),
                    FinishDate: '',
                    Finished: false,
                    Exercises: exercises
                }).then(() => {
                    response.Status = true;
                    response.Body.TrainingID = trainingUrl;

                    return done(response);

                }).catch(err => {
                    response.Status = false;
                    response.Body.Msg = err.message;

                    return done(response);
                })
            }
        });
    })
}