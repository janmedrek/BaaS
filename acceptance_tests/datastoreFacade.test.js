// ESLint parser variables (so it does not highligh mocha functions)
/* global describe it */

const expect = require('chai').expect;

const datastoreFacade = require('./datastoreFacade');

describe('Datstore Facade', () => {
    describe('Get User', () => {
        it('Should properly fetch user', async () => {
            const result = await datastoreFacade.getUser('testUser');

            expect(result).to.have.property('passwordHash');
            expect(result).to.have.property('passwordSalt');
        });

        it('Should return false if user was not found', async () => {
            const result = await datastoreFacade.getUser('!!!');

            expect(result).to.equal(false);
        });
    });

    describe('Save User', () => {
        it('Should save user', async () => {
            const result = await datastoreFacade.saveUser('testUser', 'testHash', 'testSalt');

            expect(result[0]).to.have.property('mutationResults');
            expect(result[0]).to.have.property('indexUpdates');
        });

        it('Should throw an error on invalid data', async () => {
            try {
                await datastoreFacade.saveUser('testUser');
            } catch (err) {
                expect(err).to.have.property('code');
                expect(err).to.have.property('message');
            }
        });
    });

    describe('Get Statistics', () => {
        it('Should properly fetch statistics', async () => {
            const result = await datastoreFacade.getStatistics('testUser');

            expect(result).to.have.property('matchesWon');
            expect(result).to.have.property('matchesPlayed');
        });

        it('Should return false if user is not present in the DB', async () => {
            const result = await datastoreFacade.getStatistics('!!!');

            expect(result).to.equal(false);
        });
    });

    describe('Save Statistics', () => {
        it('Should properly save statistics', async () => {
            const statistics = {
                matchesPlayed: 10,
                matchesWon: 10,
            };

            const result = await datastoreFacade.saveStatistics('testUser', statistics);

            expect(result[0]).to.have.property('mutationResults');
            expect(result[0]).to.have.property('indexUpdates');
        });

        it('Should throw an error on invalid data', async () => {
            try {
                await datastoreFacade.saveStatistics('testUser');
            } catch (err) {
                expect(err).to.have.property('code');
                expect(err).to.have.property('message');
            }
        });
    });
});

