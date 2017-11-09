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
router.post('/lobbies', async (req, res) => {

});

// Get lobby info
router.get('/lobbies/:lobbyId', async (req, res) => {

});

// Start game
router.post('/lobbies/:lobbyId/startGame', async (req, res) => {

});

// Add a player to the lobby
router.post('/lobbies/:lobbyId/players', async (req, res) => {

});

// Remove a player from the lobby
router.delete('/lobbies/:lobbyId/players', async (req, res) => {

});

module.exports = router;
