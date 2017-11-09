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
        const lobbyId = lobbyModule.createSecureLobby({ username: req.headers.user });
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
        res.status(200).send(lobby);
    }
});

// Start game
router.post('/:lobbyId/startGame', async (req, res) => {

});

// Add a player to the lobby
router.post('/:lobbyId/players', async (req, res) => {
    const password = req.body.password;

    try {
        lobbyModule.addPlayerToTheLobby({ username: req.headers.user }, req.params.lobbyId, password);
        res.status(200).send();
    } catch (err) {
        res.status(err.staus).send(err.message);
    }
});

// Remove a player from the lobby
router.delete('/:lobbyId/players', async (req, res) => {

});

module.exports = router;
