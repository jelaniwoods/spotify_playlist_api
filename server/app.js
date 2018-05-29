/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const secret = require('./config/secret.js');

const client_id = secret.client_id; // Your client id
const client_secret = secret.client_secret; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Or Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

const app = express();

app.use(express.static(__dirname + '/public'))
    .use(cookieParser());

app.get('/login', function (req, res) {

    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    let scope = 'user-read-private user-read-email user-read-playback-state playlist-modify-public playlist-read-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', function (req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                let access_token = body.access_token,
                    refresh_token = body.refresh_token;
                // for (let key in response) {
                //     if (response.hasOwnProperty(key)) {
                //         console.log(key + " -> " + response[key]);
                //     }
                // }

                let options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                };
                var id = '';
                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                    id = body.id;
                    console.log('BODE: \n' + body.id + '  -.');

                    res.redirect('http://localhost:3000/t/' +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token,
                            id: id
                        }));

                });
                console.log(id + ' pls? ')
                // we can also pass the token to the browser to make requests from there
                // res.redirect('http://localhost:3000/#' +
                //     querystring.stringify({
                //         access_token: access_token,
                //         refresh_token: refresh_token,
                //         id: id
                //     }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
            console.log('done ' + id);
        });
    }
});

app.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    let refresh_token = req.query.refresh_token;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

console.log('Listening on 8888');
app.listen(8888);
