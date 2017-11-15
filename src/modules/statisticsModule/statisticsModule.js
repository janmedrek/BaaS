const datastoreFacade = require('../datastoreFacade/datastoreFacade');

const statisticsModule = {};

statisticsModule.getStatistics = async username => datastoreFacade.getStatistics(username);

statisticsModule.saveStatistics = async (username, statistics) =>
    datastoreFacade.saveStatistics(username, statistics);

module.exports = statisticsModule;
