const datastoreFacade = require('../datastoreFacade/datastoreFacade');

const statisticsModule = {};

const mergeStatistics = async (obj1, obj2) => {
    let keys = Object.keys(obj1);

    const result = {};

    keys.map((currentKey) => {
        if (obj2[`${currentKey}`]) {
            result[`${currentKey}`] = obj1[`${currentKey}`] + obj2[`${currentKey}`];
        } else {
            result[`${currentKey}`] = obj1[`${currentKey}`];
        }

        return true;
    });

    keys = Object.keys(obj2);

    keys.map((currentKey) => {
        if (!result[`${currentKey}`]) {
            result[`${currentKey}`] = obj2[`${currentKey}`];
        }

        return true;
    });

    return result;
};

statisticsModule.getStatistics = async username => datastoreFacade.getStatistics(username);

statisticsModule.saveStatistics = async (username, statistics) => {
    // TODO:
    // const result = await mergeStatistics({ lol: 1, lel: 2, lul: 3 }, { lol: 2, lil: 4, lulu: 3 });
    // console.log(result);
    try {
        const result = await datastoreFacade.saveStatistics(username, statistics);
        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = statisticsModule;
