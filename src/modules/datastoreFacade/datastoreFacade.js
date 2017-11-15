const datastore = require('@google-cloud/datastore')({
    projectId: 'baas-185123',
    keyFilename: 'src/res/datastoreKey.json',
});

const datastoreFacade = {};

/**
 * Fetches user by their ID (username)
 * @param {string} username - username of user to get info on
 * @return {object} user information
 */
datastoreFacade.getUser = async (username) => {
    const key = datastore.key(['User', username]);
    const res = await datastore.get(key);
    if (res[0]) {
        return res[0];
    }
    return false;
};

/**
 * Saves user in datastore
 * @param {string} username - username to save (must be unique)
 * @param {string} hash - password hash
 * @param {string} salt - salt used to generate hash
 * @returns {bool} information on success/failure
 * @throws {object} error
 */
datastoreFacade.saveUser = async (username, hash, salt) => {
    if (!username || !hash || !salt) {
        const err = {
            code: 400,
            message: 'Not enough information to save user',
        };
        throw err;
    }

    const key = datastore.key(['User', username]);
    const userData = {
        passwordHash: hash,
        passwordSalt: salt,
    };

    const result = await datastore.save({
        key,
        data: userData,
    });

    return result;
};

/**
 * Fetches users statistics by their ID (username)
 * @param {string} username - username of user to get info on
 * @return {object} user statistics
 */
datastoreFacade.getStatistics = async (username) => {
    const key = datastore.key(['Statistics', username]);
    const res = await datastore.get(key);

    if (res[0]) {
        return res[0].statistics;
    }
    return false;
};

/**
 * Saves users statistics in datastore
 * @param {string} username - username to save (must be unique)
 * @param {string} statistics - data to save
 * @returns {bool} information on success/failure
 * @throws {object} error
 */
datastoreFacade.saveStatistics = async (username, statistics) => {
    if (!username || !statistics) {
        const err = {
            code: 400,
            message: 'Not enough information to save statistics',
        };
        throw err;
    }

    const key = datastore.key(['Statistics', username]);
    const userData = {
        statistics,
    };

    const result = await datastore.save({
        key,
        data: userData,
    });

    return result;
};

module.exports = datastoreFacade;
