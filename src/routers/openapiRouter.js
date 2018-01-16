const express = require('express');
const userManagementModule = require('../modules/userManagementModule/userManagementModule');
const statisticsModule = require('../modules/statisticsModule/statisticsModule')

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send('Provide username and password for the user');
        }
        await userManagementModule.registerUser(username, password);
    } catch (err) {
        res.status(409).send();
    }
    res.status(201).send();
});

router.get('/statistics/:username', async (req, res) => {
    const stats = statisticsModule.getStatistics(req.params.username);

    if (!stats) {
        res.status(404).send('Statistics for that user were not found');
    } else {
        res.status(200).send(stats);
    }
});

module.exports = router;
