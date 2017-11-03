const express = require('express');
const gameModule = require('../modules/gameModule');
const authModule = require('../modules/authModule');

const router = express.Router();

// Authentication middleware
router.use(async (req, res, next) => {
    if (authModule.authenticateUser(req)) {
        next();
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Create new game
router.post('/', async (req, res) => {
    const gameId = gameModule.addGame();
    res.status(201).send(gameId);
});

// Get game state
router.get('/:gameId', async (req, res) => {
    const game = gameModule.getGame(req.params.gameId);
    res.status(200).send(game);
});

// Update game state
router.put('/:gameId', async (req, res) => {
    const result = gameModule.updateGameState(req.params.gameId, req.body);

    if (result) {
        res.status(200).send();
    } else {
        res.status(500).send();
    }
});

module.exports = router;
