const MongoCLient = require('mongodb').MongoClient;

const checkSigIn = require('./checkSignInStatus');
const config = require('../config.json');

module.exports.addProgram = addProgram;

async function addProgram(req, res) {
    var token
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: ''
        }
    }

    var program_name = req.body.Program_name;
    var exercises = req.body.Exercises;
    var token = req.body.Token;

    var checkToken = checkSigIn.checkSignInStatusServer(token);

    if (checkToken.Status == false) {
        response.Status = null;
        response.Login = false

        res.send(response);

        return;
    }

    if (program_name == '' || exercises.length == 0) {
        response.Status = false;
        response.Body.Msg = 'Program name and exercises cannot be empty';

        res.send(response);

        return;
    }

    var login = checkToken.Body.Decode.Email;

    var added = addProgramToDB(program_name, exercises, login);

    if (added.Status == false) {
        response.Status = false;
        response.Body.Msg = response.Body.Msg;

        res.send(response);

        return;
    }

    response.Status = true;
    response.Body.Msg = 'add program response';

    res.send(response);
}

function addProgramToDB(name, exercises, login) {
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
                console.log('ERROR, libs/addProgram.js, addProgramToDB()1: ' + err.message);

                response.Status = false;
                response.Body.Msg = err.message;

                return response;
            } else {
                db.collection('programs').findOne({
                    Login: login,
                    Name: name
                }).then(result => {
                    if (result != null) {
                        response.Status = false;
                        response.Body.Msg = 'Such program existed';

                        return done(response);
                    } else {
                        db.collection('programs').insert({
                            Login: login,
                            Name: name,
                            Exercises: exercises
                        }).then(() => {
                            return done(response);
                        })
                            .catch(err => {
                                console.log('ERROR, libs/addProgram.js, addProgramToDB()3: ' + err.message);

                                response.Status = false;
                                response.Body.Msg = err.message;

                                return response;
                            });
                    }
                }).catch(err => {
                    console.log('ERROR, libs/addProgram.js, addProgramToDB()2: ' + err.message);

                    response.Status = false;
                    response.Body.Msg = err.message;

                    return done(response);
                });
            }
        });
    });
}