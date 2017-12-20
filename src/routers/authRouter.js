const express = require('express');
const authModule = require('../modules/authModule/authModule');

const router = express.Router();

// Check user auth
// Verifies credentials just like any other secured router
router.post('/', async (req, res) => {
    const result = await authModule.authenticateUser(req);
    if (result) {
        res.status(200).send();
    } else {
        res.status(401).send();
    }
});

module.exports = router;
