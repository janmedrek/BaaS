const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Boardgame as a Service');
});

module.exports = router;
