const express = require('express');
const userManagementModule = require('../modules/userManagementModule/userManagementModule');

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

module.exports = router;
