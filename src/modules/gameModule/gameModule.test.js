// ESLint parser variables (so it does not highligh mocha functions)
/* global describe before beforeEach after it */

const expect = require('chai').expect;
const sinon = require('sinon');

const gameModule = require('./gameModule');

describe('Game Module', () => {
    describe('Create Game', () => {
        let memDBPushStub;

        before(() => {
            memDBPushStub = sinon.stub(gameModule.memDB.games, 'push');
        });

        beforeEach(() => {
            memDBPushStub.reset();
        });

        after(() => {
            memDBPushStub.restore();
        });

        it('Should create game', () => {
            memDBPushStub.returns(true);

            const result = gameModule.createGame(['testPlayer1', 'testPlayer2']);

            expect(result).to.not.be.undefined;

            expect(memDBPushStub.calledOnce).to.equal(true);
        });
    });

    describe('Get Game', () => {
        let memDBFindStub;

        before(() => {
            memDBFindStub = sinon.stub(gameModule.memDB.games, 'find');
        });

        beforeEach(() => {
            memDBFindStub.reset();
        });

        after(() => {
            memDBFindStub.restore();
        });

        it('Should properly fetch game', () => {
            const gameObj = {
                uuid: 'someKindOfUuid',
                players: ['testPlayer1', 'testPlayer2'],

                gameState: 'waiting',
                boardState: {},
                statistics: {},
            };

            memDBFindStub.returns(gameObj);

            const result = gameModule.getGame(gameObj.uuid);

            expect(result).to.equal(gameObj);

            expect(memDBFindStub.calledOnce).to.equal(true);
        });
    });

    describe('Update Game State', () => {
        let getGameStub;

        before(() => {
            getGameStub = sinon.stub(gameModule, 'getGame');
        });

        beforeEach(() => {
            getGameStub.reset();
        });

        after(() => {
            getGameStub.restore();
        });

        it('Should update state of the game', () => {
            const gameObj = {
                uuid: 'someKindOfUuid',
                players: ['testPlayer1', 'testPlayer2'],

                currentPlayer: 'testPlayer1',
                gameState: 'waiting',
                boardState: {},
                statistics: {},
            };

            getGameStub.returns(gameObj);

            const result = gameModule.updateGameState('someKindOfUuid', { test: true, prod: false });

            expect(result).to.not.be.undefined;

            expect(result).to.have.property('gameState');
            expect(result.boardState).to.have.property('test');
            expect(result.boardState).to.have.property('prod');
        });

        it('Should throw an error if the game was not found', () => {
            getGameStub.returns();

            try {
                gameModule.updateGameState('testId', {});
            } catch (err) {
                expect(err).to.have.property('code');
                expect(err).to.have.property('message');
            }
        });
    });

    describe('Delete Game', () => {
        let getGameStub;
        let memDBIndexStub;
        let memDBSpliceStub;

        before(() => {
            getGameStub = sinon.stub(gameModule, 'getGame');
            memDBIndexStub = sinon.stub(gameModule.memDB.games, 'indexOf');
            memDBSpliceStub = sinon.stub(gameModule.memDB.games, 'splice');
        });

        beforeEach(() => {
            getGameStub.reset();
            memDBIndexStub.reset();
            memDBSpliceStub.reset();
        });

        after(() => {
            getGameStub.restore();
            memDBIndexStub.restore();
            memDBSpliceStub.restore();
        });

        it('Should delete game', () => {
            const gameObj = {
                uuid: 'someKindOfUuid',
                players: ['testPlayer1', 'testPlayer2'],

                currentPlayer: 'testPlayer1',
                gameState: 'waiting',
                boardState: {},
                statistics: {},
            };

            getGameStub.returns(gameObj);
            memDBIndexStub.returns(1);
            memDBSpliceStub.returns(true);

            gameModule.deleteGame('someKindOfUuid');

            expect(getGameStub.calledOnce).to.equal(true);
            expect(getGameStub.calledWith(gameObj.uuid)).to.equal(true);

            expect(memDBIndexStub.calledOnce).to.equal(true);
            expect(memDBIndexStub.calledWith(gameObj)).to.equal(true);

            expect(memDBSpliceStub.calledOnce).to.equal(true);
            expect(memDBSpliceStub.calledWith(1, 1)).to.equal(true);
        });

        it('Should throw an error if the game was not found', () => {
            getGameStub.returns();

            try {
                gameModule.deleteGame('testId');
            } catch (err) {
                expect(err).to.have.property('code');
                expect(err).to.have.property('message');
            }
        });
    });
});

