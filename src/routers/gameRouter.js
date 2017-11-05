const express = require('express');
const gameModule = require('../modules/gameModule/gameModule');
const authModule = require('../modules/authModule/authModule');

const router = express.Router();

// Authentication middleware
router.use(async (req, res, next) => {
    authModule.authenticateUser(req)
        .then((result) => {
            if (!result) {
                res.status(401).send('Invalid credentials');
            } else {
                req.headers.user = result;
                next();
            }
        });
});

// Create new game
// TODO: Determine if this is really needed - may be called only from inside of the server.
//       In this case this route should be removed.
router.post('/', async (req, res) => {
    const gameId = gameModule.addGame();
    res.status(201).send(gameId);
});

// Get game state
router.get('/:gameId', async (req, res) => {
    const game = gameModule.getGame(req.params.gameId);
    if (!game) {
        res.status(404).send('Game not found');
        return;
    }

    if (game.currentPlayer === req.headers.user) {
        // Okey, play now. Your move!
        res.status(200).send(game);
    } else if (game.players.indexOf(req.headers.user) > -1) {
        // Hey, get off! The other player has not finished their move yet!
        res.status(202).send(game);
    } else {
        // What are you doing here? You're not a part of this game...
        res.status(403).send();
    }
});

// Update game state
router.put('/:gameId', async (req, res) => {
    const game = gameModule.getGame(req.params.gameId);

    if (game.currentPlayer === req.headers.user) {
        // Okey, let me save new state that you've sent.
        gameModule.updateGameState(req.params.gameId, req.body);
        res.status(200).send();
    } else {
        // Not your move!
        res.status(403).send();
    }
});

module.exports = router;
