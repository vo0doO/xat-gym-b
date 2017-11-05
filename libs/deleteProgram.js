const MongoCLient = require('mongodb').MongoClient;
const mongo = require('mongodb')

const checkSigIn = require('./checkSignInStatus');
const config = require('../settings.json');

module.exports.deleteProgram = deleteProgram;

async function deleteProgram(req, res) {
    var response = {
        Status: false,
        Login: null,
        Body: {
            Msg: ''
        }
    }

    var id = req.body.Id;

    var deleted = await deleteFromDB(id);

    if (deleted.Status == false) {
        response.Status = false;
        response.Body.Msg = deleted.Body.Msg;

        res.send(response);

        return;
    }

    response.Status = true;
    response.Body.Msg = id;

    res.send(response);
}

function deleteFromDB(id) {
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
                response.Body.Msg = err;

                return response;
            } else {
                db.collection('programs').remove({
                        Url: id
                    })
                    .then(() => {
                        response.Status = true;

                        return done(response);
                    })
                    .catch(err => {
                        response.Status = false;
                        response.Body.Msg = err;

                        return response;
                    });
            }
        })
    });
}