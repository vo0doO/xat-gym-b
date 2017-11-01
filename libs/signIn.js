const MongoCLient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');

const config = require('../settings.json')

module.exports.signIn = signIn;

async function signIn(req, res) {
    var response = {
        Status: false,
        Body: {
            Msg: 'Empty'
        }
    }

    var email = req.body.Email;
    var password = req.body.Password;

    if (email == '' || password == '') {
        response.Status = false;
        response.Body.Msg = 'Email or password are empty';

        res.send(response);

        return;
    }

    try {
        var token = jwt.sign({
            Email: email
        }, config.SecretKey, {
                expiresIn: 1440,
            });
    } catch (e) {
        console.log('ERROR, libs/signIn.js, signIn(): ' + e.message);
    }

    try {
        var user = await getUser(email, password);
    } catch (e) {
        console.log('ERROR, libs/signIn.js, signIn(): ' + e.message);

        response.Status = false;
        response.Body.Msg = 'Email or password are incorrect';

        res.send(response);

        return;
    }

    if (!user.Status) {
        response.Status = false;
        response.Body.Msg = 'Email or password are incorrect';

        res.send(response);

        return;
    }

    response.Status = true;
    response.Body.Msg = 'Hello, ' + email;
    response.Body.Token = token;

    res.send(response);
}

function getUser(login, password) {
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
                console.log('ERROR, libs/signIn.js, getUser()1: ' + err.message);

                response.Status = false;
                response.Body.Msg = err.message;

                return response;
            } else {
                db.collection('logins').findOne({
                    Login: login.toString(),
                    Password: password.toString()
                }).then(result => {
                    if (result == null) {
                        response.Status = false;
                        response.Body.Data = result;
                    } else {
                        response.Status = true;
                        response.Body.Data = result;
                    }

                    return done(response);
                }).catch(err => {
                    console.log('ERROR, libs/signIn.js, getUser()2: ' + err.message);

                    response.Status = false;
                    response.Body.Msg = err.message;

                    return response;
                });
            }
        });
    });
}