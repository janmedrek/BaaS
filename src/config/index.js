const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/', async (req, res) => {
    fs.readFile('./src/config/index.html', (err, html) => {
        if (err) {
            throw err;
        }
        res.writeHeader(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    });
});

module.exports = router;
