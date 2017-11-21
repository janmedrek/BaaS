// ESLint parser variables (so it does not highligh mocha functions)
/* global describe before beforeEach after it */

const expect = require('chai').expect;
const sinon = require('sinon');

const statisticsModule = require('./statisticsModule');
const datastoreFacade = require('../datastoreFacade/datastoreFacade');

describe('Statistics Module', () => {
    describe('Get Statistics', () => {
        let datastoreGetStatisticsStub;

        before(() => {
            datastoreGetStatisticsStub = sinon.stub(datastoreFacade, 'getStatistics');
        });

        beforeEach(() => {
            datastoreGetStatisticsStub.reset();
        });

        after(() => {
            datastoreGetStatisticsStub.restore();
        });

        it('Should fetch user statistics', async () => {
            const playerInfo = {
                username: 'testPlayer',
            };

            const statistics = {
                matchesWon: 10,
                matchesPlayed: 10,
            };

            datastoreGetStatisticsStub.returns(statistics);

            const result = await statisticsModule.getStatistics(playerInfo.username);

            expect(result).to.equal(statistics);

            expect(datastoreGetStatisticsStub.calledOnce).to.equal(true);
            expect(datastoreGetStatisticsStub.calledWith(playerInfo.username)).to.equal(true);
        });

        it('Should throw an error when user not found', async () => {
            const playerInfo = {
                username: 'testPlayer',
            };

            const error = {
                code: 404,
                message: 'Users statistics not found',
            };

            datastoreGetStatisticsStub.throws(error);

            try {
                await statisticsModule.getStatistics(playerInfo.username);
            } catch (err) {
                expect(err.code).to.equal(404);
                expect(err.message).to.equal('Users statistics not found');

                expect(datastoreGetStatisticsStub.calledOnce).to.equal(true);
                expect(datastoreGetStatisticsStub.calledWith(playerInfo.username)).to.equal(true);
            }
        });
    });

    describe('Save Statistics', () => {
        let datastoreSaveStatisticsStub;

        before(() => {
            datastoreSaveStatisticsStub = sinon.stub(datastoreFacade, 'saveStatistics');
        });

        beforeEach(() => {
            datastoreSaveStatisticsStub.reset();
        });

        after(() => {
            datastoreSaveStatisticsStub.restore();
        });

        it('Should save user statistics', async () => {
            const playerInfo = {
                username: 'testPlayer',
            };

            const statistics = {
                matchesWon: 10,
                matchesPlayed: 10,
            };

            datastoreSaveStatisticsStub.returns(true);

            const result = await statisticsModule.saveStatistics(playerInfo.username, statistics);

            expect(result).to.equal(true);

            expect(datastoreSaveStatisticsStub.calledOnce).to.equal(true);
            expect(datastoreSaveStatisticsStub.calledWith(playerInfo.username, statistics))
                .to.equal(true);
        });

        it('Should throw an error when not enough data', async () => {
            const error = {
                code: 400,
                message: 'Not enough information to save statistics',
            };

            datastoreSaveStatisticsStub.throws(error);

            try {
                await statisticsModule.saveStatistics();
            } catch (err) {
                expect(err.code).to.equal(error.code);
                expect(err.message).to.equal(error.message);
            }
        });
    });
});

