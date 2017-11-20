const datastoreFacade = require('../datastoreFacade/datastoreFacade');

const statisticsModule = {};

statisticsModule.getStatistics = async username => datastoreFacade.getStatistics(username);

statisticsModule.saveStatistics = async (username, statistics) => {
    try {
        const result = await datastoreFacade.saveStatistics(username, statistics);
        return result;
    } catch (err) {
        throw err;
    }
};


module.exports = statisticsModule;
