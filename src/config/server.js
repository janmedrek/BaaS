const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');

const app = express();
const port = process.env.PORT || 8080;

function haltOnTimedout(req, res, next) {
  if (!req.timedout) {
    next();
  }
}

app.use(timeout(5000));
app.use(haltOnTimedout);

app.use(bodyParser.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('BAD JSON');
    res.status(err.status).send(err);
  } else {
    next();
  }
});

app.use('/', require('./index'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
