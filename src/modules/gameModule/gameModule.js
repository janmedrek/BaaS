const uuidv4 = require('uuid/v4');

const gameModule = {};

gameModule.memDB = {
    games: [],
};

/**
 * Creates game
 * @param {array} playersData - array containing player objects
 * @returns {string} ID of a game that was created
 */
gameModule.createGame = (playersData) => {
    const gameId = uuidv4();

    const game = {
        uuid: gameId,

        gameState: 'waiting',
        boardState: {},
        statistics: {},
    };

    const players = playersData.slice();
    game.players = players;
    game.currentPlayer = players[0].username;

    gameModule.memDB.games.push(game);

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
 * @returns {object} updated game
 * @throws {object} err
 */
gameModule.updateGameState = (gameId, state) => {
    const game = gameModule.getGame(gameId);

    if (!game) {
        const err = {
            code: 404,
            message: 'Game not found',
        };
        throw err;
    }

    game.boardState = state;

    // Change current player to the one that is next on the list
    const index = game.players.indexOf(game.currentPlayer);
    if (index >= 0 && index < game.players.length - 1) {
        game.currentPlayer = game.players[index + 1].username;
    } else {
        game.currentPlayer = game.players[0].username;
    }
    return game;
};

/**
 * Deletes game
 * @param {string} gameId
 * @returns {bool} information on success / failure
 * @throws {object} error
 */
gameModule.deleteGame = (gameId) => {
    const toDelete = gameModule.getGame(gameId);

    // Throw an error if game was not found
    if (!toDelete) {
        const err = {
            code: 404,
            message: 'Game not found',
        };
        throw err;
    } else {
        const index = gameModule.memDB.games.indexOf(toDelete);
        gameModule.memDB.games.splice(index, 1);
        return true;
    }
};

module.exports = gameModule;
