const uuidv4 = require('uuid/v4');
const gameModule = require('../gameModule/gameModule');

const lobbyModule = {};

lobbyModule.memDB = {
    lobbies: [],
};

/**
 * Creates lobby
 * @param {string} playerName - name of the player that created the lobby
 * @returns {string} lobbyId
 */
lobbyModule.createLobby = (playerInfo) => {
    const lobbyId = uuidv4();

    lobbyModule.memDB.lobbies.push({
        uuid: lobbyId,
        players: [playerName],
        state: 'waiting',
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

};

/**
 * Creates the game for the lobby and switches it's state
 * @param {string} lobbyId - id of the lobby to perform operation on
 * @returns {string} uuid of game created for this lobby
 * @throws {object} error
 */
lobbyModule.startGame = (lobbyId) => {

};

/**
 * Registers player in the lobby
 * @param {object} playerInfo - information on the user
 * @param {string} lobbyId - id of the lobby to perform operation on
 * @returns {bool} information on success
 * @throws {object} error
 */
lobbyModule.addPlayerToLobby = (playerInfo, lobbyId) => {

};

/**
 * Removes player from a lobby
 * @param {object} playerInfo - information on the user
 * @param {string} lobbyId - id of the lobby to perform operation on
 * @returns {bool} information on success
 * @throws {object} error
 */

module.exports = lobbyModule;
