const datastoreFacade = require('../datastoreFacade/datastoreFacade');
const md5 = require('md5');

const userManagementModule = {};

/**
 * Registers user in database
 * @param {string} username
 * @param {string} password
 * @returns {object} Created user
 * @throws {object} Error on username conflict
 */
userManagementModule.registerUser = async (username, password) => {
    // Check whether username is unique or not
    const data = await datastoreFacade.getUser(username);
    if (data) {
        // User with that name already exists
        // TODO: RETURN ERROR
        const err = {
            message: 'user exists',
        };

        throw err;
    }

    const salt = Math.random().toString(36).substr(2, 15);
    const hash = md5(`${password}${salt}`);

    const result = datastoreFacade.saveUser(username, hash, salt);

    return result;
};

module.exports = userManagementModule;
