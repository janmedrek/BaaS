const datastoreFacade = require('../datastoreFacade/datastoreFacade');
const base64 = require('base-64');
const md5 = require('md5');

const authModule = {};

/**
 * Authenticates user through basic auth
 * @param {object} req - http request with Authorization header
 * @returns {bool} false on failed authentication
 * @returns {string} username on successful authentication
 */
authModule.authenticateUser = async (req) => {
    // Decode basic auth credentials
    const message = req.headers.authorization;
    const encodedCredentials = message.split(' ')[1];
    const credentials = base64.decode(encodedCredentials).split(':');

    const userData = await datastoreFacade.getUser(credentials[0]);

    if (!userData) {
        // User does not exist
        return false;
    }

    // User exists, check passwords match
    if (userData.passwordHash === md5(`${credentials[1]}${userData.passwordSalt}`)) {
        return credentials[0];
    }
    return false;
};

module.exports = authModule;
