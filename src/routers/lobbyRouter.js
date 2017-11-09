const express = require('express');
const lobbyModule = require('../modules/lobbyModule/lobbyModule');
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

// Create a new lobby
router.post('/', async (req, res) => {
    if (!req.headers.user) {
        res.status(500).send('Error');
        return;
    }

    if (req.body.password) {
        const password = req.body.password;
        const lobbyId = lobbyModule.createSecureLobby({ username: req.headers.user }, password);
        res.status(201).send(lobbyId);
    } else {
        const lobbyId = lobbyModule.createLobby({ username: req.headers.user });
        res.status(201).send(lobbyId);
    }
});

// Get all lobbies
router.get('/', async (req, res) => {
    res.status(200).send(lobbyModule.getLobbies());
});

// Get lobby info
router.get('/:lobbyId', async (req, res) => {
    const lobby = lobbyModule.getLobby(req.params.lobbyId);

    if (!lobby) {
        res.status(404).send('Lobby not found');
    } else {
        // If lobby is terminating - remove player from it and send them game id
        if (lobby.status === 'TERMINATING') {
            res.status(202).send(lobby.gameId);
            lobbyModule.removePlayerFromLobby({ username: req.headers.user }, lobby.uuid);
            return;
        }
        res.status(200).send(lobby);
    }
});

// Start game
router.post('/:lobbyId/startGame', async (req, res) => {
    const lobbyId = req.params.lobbyId;

    try {
        const gameId = lobbyModule.startGame(lobbyId);
        res.status(201).send(gameId);

        lobbyModule.removePlayerFromLobby({ username: req.headers.user }, lobbyId);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
});

// Add a player to the lobby
router.post('/:lobbyId/players', async (req, res) => {
    const password = req.body.password;
    const lobbyId = req.params.lobbyId;

    try {
        lobbyModule.addPlayerToLobby({ username: req.headers.user }, lobbyId, password);
        res.status(200).send();
    } catch (err) {
        res.status(err.staus).send(err.message);
    }
});

// Remove a player from the lobby
router.delete('/:lobbyId/players', async (req, res) => {
    const lobbyId = req.params.lobbyId;

    try {
        lobbyModule.removePlayerFromLobby({ username: req.headers.user }, lobbyId);
        res.status(200).send();
    } catch (err) {
        res.status(err.status).send(err.message);
    }
});

module.exports = router;
