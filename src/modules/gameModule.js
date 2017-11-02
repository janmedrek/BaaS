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
        state: {},
        statistics: {},
    });

    return gameId;
};

gameModule.getGame = (gameId) => {
    // returns true if ids match
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
    return true;
};

module.exports = gameModule;
