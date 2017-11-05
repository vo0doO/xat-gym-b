const MongoCLient = require('mongodb').MongoClient;
const mongo = require('mongodb')

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.currentProgram = currentProgram;

async function currentProgram(req, res) {
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: '',
            Program: null
        }
    }

    var token = req.body.Token;

    try {
        var checkToken = checkSigIn.checkSignInStatusServer(token);
    } catch (e) {
        console.log(e);
    }

    if (checkToken.Status == false) {
        response.Status = false;
        response.Login = false;

        res.send(response);

        return;
    }

    var program_id = req.body.ID;

    if (program_id == null || program_id == undefined || program_id == '') {
        response.Status = false;
        response.Login = true;

        response.Body.Msg = 'Program ID cannot be empty';

        res.send(response);

        return;
    }

    response.Login = true;

    try {
        var founded_program = await getProgramInDB(program_id);
    } catch (err) {
        console.log(err);

        response.Status = false;
        response.Login = true;
        response.Body.Msg = err;

        res.send(response);

        return;
    }   

    if (founded_program.Status == false) {
        response.Status = false;
        response.Login = true;

        response.Body.Msg = founded_program.Body.Msg;
    }

    if (founded_program.Status == true) {
        response.Status = true;
        response.Login = true;

        response.Body.Program = founded_program.Body.Result;
    }

    res.send(response);
}

function getProgramInDB(id) {
    console.log(id);
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
                console.log('ERROR, libs/currentProgram.js, getProgramInDB()1: ' + err.message);

                response.Status = false;
                response.Body.Msg = err.message;

                return done(response);
            } else {
                db.collection('programs').findOne({
                    Url: id
                }, (err, result) => {
                    if (err) {
                        console.log('ERROR, libs/currentProgram.js, getProgramInDB()2: ' + err.message);

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

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}