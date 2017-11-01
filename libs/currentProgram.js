const MongoCLient = require('mongodb').MongoClient;
const mongo = require('mongodb')

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.currentProgram = currentProgram;

function currentProgram(req, res) {
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: ''
        }
    }

    var checkToken = checkSigIn.checkSignInStatusServer(token);

    if (checkToken.Status == false) {
        response.Status = false;
        response.Login = false;

        res.send(response);

        return;
    }

    var program_id = req.body.ID;

    if (program_id == null || program_id == undefined || program_id == '') {
        response.Status = true;
        response.Login = false;

        response.Body.Msg = 'Program ID cannot be empty';

        res.send(response);

        return;
    }



    getProgramInDB(id)

    response.Status = true;
    response.Body.Msg = '666';

    res.send(response);
}

function getProgramInDB(id) {
    return new Promise(done => {
        var response = {
            Status: false,
            Body: {
                Msg: 'Empty',
                Data: null
            }
        }

        MongoCLient.connect(config.MongoURL, async (err, db) => {
            if (err) {
                console.log('ERROR, libs/currentProgram.js, getProgramInDB()1: ' + err.message);

                response.Status = false;
                response.Body.Msg = err.message;

                return done(response);
            } else {
                db.collection('programs').findOne({
                    _id: new mongo.ObjectID(id)
                }).toArray().then(result => {
                    response.Status = true;
                    response.Body.Result = result;

                    return done(response);
                }).catch(err => {
                    console.log('ERROR, libs/currentProgram.js, getProgramInDB()2: ' + err.message);

                    response.Status = false;
                    response.Body.Msg = err.message;

                    return done(response);
                })
            }
        });
    });
}