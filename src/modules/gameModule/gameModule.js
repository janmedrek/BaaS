const uuidv4 = require('uuid/v4');

const gameModule = {};

gameModule.memDB = {
    games: [],
};

gameModule.addGame = (playersData) => {
    const gameId = uuidv4();

    gameModule.memDB.games.push({
        uuid: gameId,

        players: playersData,
        currentPlayer: playersData[0],

        gameState: 'waiting',
        boardState: {},
        statistics: {},
    });

    return gameId;
};

gameModule.getGame = (gameId) => {
    // Returns true if ids match
    const findById = currentGame => currentGame.uuid === gameId;

    return gameModule.memDB.games.find(findById);
};

gameModule.updateGameState = (gameId, state) => {
    const findById = currentGame => currentGame.uuid === gameId;

    const game = gameModule.memDB.games.find(findById);
    if (!game) {
        return false;
    }

    game.state = state;

    // TODO:change current player
    const index = game.players.indexOf(game.currentPlayer);
    if (index >= 0 && index < game.players.length - 1) {
        game.currentPlayer = game.players[index + 1];
    } else {
        game.currentPlayer = game.players[0];
    }
    return true;
};

module.exports = gameModule;
