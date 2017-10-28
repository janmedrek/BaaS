const express = require('express');

const router = express.Router();

router.get('/:gameId', async (req, res) => {
  res.status(200).send(`${req.params.gameId}`);
});
