/* eslint-disable no-console */

const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');

const https = require('https');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('src/res/certs/fullchain.pem'),
    key: fs.readFileSync('src/res/certs/privkey.pem'),
};

const app = express();

// Port should be set to 80 / 443 on prod
const port = process.env.PORT || 80;
const portSecure = process.env.PORTS || 443;

function haltOnTimedout(req, res, next) {
    if (!req.timedout) {
        next();
    }
}

// Set the timeout
app.use(timeout(10000));
app.use(haltOnTimedout);

// Helmet sets proper https headers
app.use(require('helmet')());

// Parse JSONs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(err.status).send(err);
    } else {
        next();
    }
});

// Routers
app.use('/', require('./index'));
app.use('/auth', require('../routers/authRouter'));
app.use('/games', require('../routers/gameRouter'));
app.use('/openapi', require('../routers/openapiRouter'));
app.use('/lobbies', require('../routers/lobbyRouter'));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

https.createServer(options, app).listen(portSecure, () => {
    console.log(`Server is running at https://localhost:${portSecure}`);
});

module.exports = app;
