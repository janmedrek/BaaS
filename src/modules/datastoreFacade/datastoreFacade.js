const datastore = require('@google-cloud/datastore')({
    projectId: 'baas-185123',
    keyFilename: '../res/datastoreKey.json',
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
 */
datastoreFacade.saveUser = async (username, hash, salt) => {
    if (!username || !hash || !salt) {
        // TODO: ERROR THROWING
        return 'not enough values';
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

module.exports = datastoreFacade;
