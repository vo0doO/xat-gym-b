const MongoCLient = require('mongodb').MongoClient;

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.updateProgram = updateProgram;

async function updateProgram(req, res) {
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: ''
        }
    }

    var token = req.body.Token;
    var programURL = req.body.ProgramURL;
    var exs = req.body.Exs;

    try {
        var checkToken = checkSigIn.checkSignInStatusServer(token);
    } catch (e) {
        console.log(e);

        response.Status = false;
        response.Login = false;

        res.send(response);

        return;
    }

    if (checkToken.Status == false) {
        response.Status = false;
        response.Login = false;

        res.send(response);

        return;
    }

    var login = checkToken.Body.Decode.Email;

    console.log('Token: ' + token);
    console.log('Program Url: ' + programURL);

    var deleted_result = await deleteExFromDB(programURL, login, exs);

    res.send(response);
}

function deleteExFromDB(id, login, exs) {
    return new Promise(done => {
        var response = {
            Status: false,
            Body: {
                Msg: 'Empty',
                Data: null
            }
        }

        console.log('new exs: ' + JSON.stringify(exs));

        MongoCLient.connect(config.MongoURL, (err, db) => {
            if (err) {
                console.log('ERROR, libs/updateProgram.js, deleteExFromDB()1: ' + err);

                response.Status = false;
                response.Body.Msg = err;

                return response;
            } else {
                db.collection('programs').findOneAndUpdate({
                        Url: id,
                        Login: login
                    }, {
                        $set: {
                            Exercises: exs
                        }
                    }, (err, result) => {
                        if (err) {
                            console.log(err);

                            response.Status = false;
                            response.Body.Msg = err.message;
                            
                            db.close();

                            return done(response);
                        } else {
                            console.log(result);

                            response.Status = true;

                            db.close();

                            return done(response);
                        }
                    });
            }
        })
    });
}