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
    // Check if data is present
    if (!username || !password) {
        const error = {
            code: 400,
            message: 'Not enough information',
        };

        throw error;
    }
    // Check whether username is unique or not
    const data = await datastoreFacade.getUser(username);
    if (data) {
        // User with that name already exists
        // TODO: RETURN ERROR
        const error = {
            code: 409,
            message: 'User with that name already exists',
        };

        throw error;
    }

    const salt = Math.random().toString(36).substr(2, 15);
    const hash = md5(`${password}${salt}`);

    const result = datastoreFacade.saveUser(username, hash, salt);

    return result;
};

module.exports = userManagementModule;
