const uuidv4 = require('uuid/v4');
const gameModule = require('../gameModule/gameModule');

const lobbyModule = {};

lobbyModule.memDB = {
    lobbies: [],
};

/**
 * Fetches lobby with given ID
 * @param {string} lobbyId - uuid of a lobby to find
 * @returns {object} lobby
 */
lobbyModule.getLobby = (lobbyId) => {
    // Returns true if ids match
    const findById = currentLobby => currentLobby.uuid === lobbyId;

    const res = lobbyModule.memDB.lobbies.find(findById);

    // We cannot return password to the lobby in json...
    if (res.password) {
        const toReturn = Object.assign({}, res);
        delete toReturn.password;
        return toReturn;
    }

    return res;
};

/**
 * Creates lobby
 * @param {string} playerInfo - info on the player that created the lobby
 * @returns {string} lobbyId
 */
lobbyModule.createLobby = (playerInfo) => {
    const lobbyId = uuidv4();

    lobbyModule.memDB.lobbies.push({
        uuid: lobbyId,
        players: [playerInfo],
        state: 'WAIT',
    });

    return lobbyId;
};

/**
 * Creates lobby with password
 * @param {string} playerInfo - info on the player that created the lobby
 * @param {string} password - password for the lobby
 * @returns {string} lobbyId
 */
lobbyModule.createSecureLobby = (playerInfo, password) => {
    const lobbyId = uuidv4();

    lobbyModule.memDB.lobbies.push({
        uuid: lobbyId,
        password,
        players: [playerInfo],
        state: 'WAIT',
    });

    return lobbyId;
};

/**
 * Terminates the lobby
 * @param {string} lobbyId - id of the lobby to delete
 * @returns {bool} information on success
 * @throws {object} error
 */
lobbyModule.deleteLobby = (lobbyId) => {
    const toDelete = lobbyModule.getLobby(lobbyId);

    // Throw an error if lobby not found
    if (!toDelete) {
        const err = {
            message: 'Lobby not found',
        };

        throw err;
    } else {
        const index = lobbyId.memDB.lobbies.indexOf(toDelete);
        lobbyId.memDB.lobbies.splice(index, 1);
        return true;
    }
};

/**
 * Creates the game for the lobby and switches it's state
 * @param {string} lobbyId - id of the lobby to perform operation on
 * @returns {string} uuid of game created for this lobby
 * @throws {object} error
 */
lobbyModule.startGame = (lobbyId) => {
    const lobby = lobbyModule.getLobby(lobbyId);

    if (lobby.players.length !== 2) {
        const error = {
            message: 'not enough players',
        };
        throw error;
    } else {
        const gameId = gameModule.createGame();
        lobby.state = 'TERMINATING';
        return gameId;
    }
};

/**
 * Registers player in the lobby
 * @param {object} playerInfo - information on the user
 * @param {string} lobbyId - id of the lobby to perform operation on
 * @param {string} password - optional, for secure lobbies
 * @returns {bool} information on success
 * @throws {object} error
 */
lobbyModule.addPlayerToLobby = (playerInfo, lobbyId, password) => {
    const lobby = lobbyModule.getLobby(lobbyId);

    if (!lobby) {
        // No lobby found, throw an error
        const err = {
            message: 'Lobby not found',
        };
        throw err;
    } else if (lobby.password) {
        if (lobby.password === password) {
            // Passwords do match, add a player to the lobby
            lobby.players.push(playerInfo);
            return true;
        }
        // Passwords do not match, throw an error
        const err = {
            message: 'Wrong password',
        };
        throw err;
    } else {
        // No password needed, add a player to the lobby
        lobby.players.push(playerInfo);
        return true;
    }
};

/**
 * Removes player from a lobby
 * @param {object} playerInfo - information on the user
 * @param {string} lobbyId - id of the lobby to perform operation on
 * @returns {bool} information on success
 * @throws {object} error
 */
lobbyModule.removePlayerFromLobby = (playerInfo, lobbyId) => {
    const lobby = lobbyModule.getLobby(lobbyId);

    // Returns true if ids match
    const findByName = currentPlayer => currentPlayer.username === playerInfo.username;

    const toDelete = lobby.players.find(findByName);

    if (!toDelete) {
        const err = {
            message: 'Player not found',
        };

        throw err;
    } else {
        const index = lobby.players.indexOf(toDelete);
        lobby.players.splice(index, 1);
        return true;
    }
};

module.exports = lobbyModule;
