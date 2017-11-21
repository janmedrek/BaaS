const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');

const app = express();
const port = process.env.PORT || 80;

function haltOnTimedout(req, res, next) {
    if (!req.timedout) {
        next();
    }
}

app.use(timeout(10000));
app.use(haltOnTimedout);

app.use(bodyParser.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(err.status).send(err);
    } else {
        next();
    }
});

app.use('/', require('./index'));
app.use('/games', require('../routers/gameRouter'));
app.use('/openapi', require('../routers/openapiRouter'));
app.use('/lobbies', require('../routers/lobbyRouter'));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
