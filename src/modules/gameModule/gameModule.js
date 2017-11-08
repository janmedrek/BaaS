// TODO: Error throwing
const uuidv4 = require('uuid/v4');

const gameModule = {};

gameModule.memDB = {
    games: [],
};

/**
 * Creates game
 * @param {array} playersData - array containing player names
 * @returns {string} ID of a game that was created
 */
gameModule.createGame = (playersData) => {
    const gameId = uuidv4();

    gameModule.memDB.games.push({
        uuid: gameId,

        players: playersData,
        currentPlayer: playersData[0].name,

        gameState: 'waiting',
        boardState: {},
        statistics: {},
    });

    return gameId;
};

/**
 * Fetches game with given ID
 * @param {string} gameId - ID of a game to find
 * @returns {object} game object
 */
gameModule.getGame = (gameId) => {
    // Returns true if ids match
    const findById = currentGame => currentGame.uuid === gameId;

    return gameModule.memDB.games.find(findById);
};

/**
 * Updates game state
 * @param {string} gameId
 * @param {object} state
 * @returns {bool} information on success / failure
 */
gameModule.updateGameState = (gameId, state) => {
    const findById = currentGame => currentGame.uuid === gameId;

    const game = gameModule.memDB.games.find(findById);
    if (!game) {
        return false;
    }

    game.state = state;

    // Change current player to the one that is next on the list
    const index = game.players.indexOf(game.currentPlayer);
    if (index >= 0 && index < game.players.length - 1) {
        game.currentPlayer = game.players[index + 1].name;
    } else {
        game.currentPlayer = game.players[0].name;
    }
    return true;
};

module.exports = gameModule;
