// ESLint parser variables (so it does not highligh mocha functions)
/* global describe before beforeEach after it */

const expect = require('chai').expect;
const sinon = require('sinon');

const lobbyModule = require('./lobbyModule');
const gameModule = require('../gameModule/gameModule');

describe('Lobby Module', () => {
    describe('Create Lobby', () => {
        let memDBPushStub;

        before(() => {
            memDBPushStub = sinon.stub(lobbyModule.memDB.lobbies, 'push');
        });

        beforeEach(() => {
            memDBPushStub.reset();
        });

        after(() => {
            memDBPushStub.restore();
        });

        it('Should create lobby', () => {
            memDBPushStub.returns(true);

            const result = lobbyModule.createLobby(['testPlayer1', 'testPlayer2']);

            expect(result).to.not.be.undefined;
            expect(memDBPushStub.calledOnce).to.equal(true);
        });

        it('Should throw an error when no player info provided', () => {
            try {
                lobbyModule.createLobby();
            } catch (err) {
                expect(err).to.have.property('code');
                expect(err).to.have.property('message');
            }
        });
    });

    describe('Create Secure Lobby', () => {
        let memDBPushStub;

        before(() => {
            memDBPushStub = sinon.stub(lobbyModule.memDB.lobbies, 'push');
        });

        beforeEach(() => {
            memDBPushStub.reset();
        });

        after(() => {
            memDBPushStub.restore();
        });

        it('Should create lobby', () => {
            memDBPushStub.returns(true);

            const result = lobbyModule.createLobby(['testPlayer1', 'testPlayer2'], 'testPassword');

            expect(result).to.not.be.undefined;
            expect(memDBPushStub.calledOnce).to.equal(true);
        });

        it('Should throw an error when no player info provided', () => {
            try {
                lobbyModule.createLobby();
            } catch (err) {
                expect(err).to.have.property('code');
                expect(err).to.have.property('message');
            }
        });

        it('Should throw an error when no password provided', () => {
            try {
                lobbyModule.createLobby(['testPlayer1', 'testPlayer2']);
            } catch (err) {
                expect(err).to.have.property('code');
                expect(err).to.have.property('message');
            }
        });
    });

    describe('Get Lobby', () => {
        let memDBFindStub;

        before(() => {
            memDBFindStub = sinon.stub(lobbyModule.memDB.lobbies, 'find');
        });

        beforeEach(() => {
            memDBFindStub.reset();
        });

        after(() => {
            memDBFindStub.restore();
        });

        it('Should return lobby', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                players: ['testPlayer1', 'testPlayer2'],
                state: 'WAIT',
            };

            memDBFindStub.returns(lobbyObj);

            const result = lobbyModule.getLobby(lobbyObj.uuid);

            expect(result).to.equal(lobbyObj);

            expect(memDBFindStub.calledOnce).to.equal(true);
        });
    });

    describe('Get Lobbies', () => {
        let memDBMapStub;

        before(() => {
            memDBMapStub = sinon.stub(lobbyModule.memDB.lobbies, 'map');
        });

        beforeEach(() => {
            memDBMapStub.reset();
        });

        after(() => {
            memDBMapStub.restore();
        });

        it('Should return list of lobbies', () => {
            const lobbiesObj = [
                {
                    uuid: 'sampleUuid',
                    type: 'any',
                    players: ['testPlayer1', 'testPlayer2'],
                    state: 'WAIT',
                },
                {
                    uuid: 'sampleUuid2',
                    type: 'any',
                    players: ['testPlayer1', 'testPlayer2'],
                    state: 'WAIT',
                },
                {
                    uuid: 'sampleUuid3',
                    type: 'any',
                    players: ['testPlayer1', 'testPlayer2'],
                    state: 'WAIT',
                },
            ];
            memDBMapStub.returns(lobbiesObj);

            const result = lobbyModule.getLobbies();

            expect(result).to.equal(lobbiesObj);

            expect(memDBMapStub.calledOnce).to.equal(true);
        });
    });

    describe('Delete Lobby', () => {
        let getLobbyStub;
        let memDBIndexStub;
        let memDBSpliceStub;

        before(() => {
            getLobbyStub = sinon.stub(lobbyModule, 'getLobby');
            memDBIndexStub = sinon.stub(lobbyModule.memDB.lobbies, 'indexOf');
            memDBSpliceStub = sinon.stub(lobbyModule.memDB.lobbies, 'splice');
        });

        beforeEach(() => {
            getLobbyStub.reset();
            memDBIndexStub.reset();
            memDBSpliceStub.reset();
        });

        after(() => {
            getLobbyStub.restore();
            memDBIndexStub.restore();
            memDBSpliceStub.restore();
        });

        it('Should delete a lobby', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                players: ['testPlayer1', 'testPlayer2'],
                state: 'WAIT',
            };

            getLobbyStub.returns(lobbyObj);
            memDBIndexStub.returns(1);
            memDBSpliceStub.returns(true);

            lobbyModule.deleteLobby('sampleUuid');

            expect(getLobbyStub.calledOnce).to.equal(true);
            expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);

            expect(memDBIndexStub.calledOnce).to.equal(true);
            expect(memDBIndexStub.calledWith(lobbyObj)).to.equal(true);

            expect(memDBSpliceStub.calledOnce).to.equal(true);
            expect(memDBSpliceStub.calledWith(1, 1)).to.equal(true);
        });

        it('Should throw an error when lobby was not found', () => {
            getLobbyStub.returns();

            try {
                lobbyModule.deleteLobby('testId');
            } catch (err) {
                expect(err).to.have.property('code');
                expect(err).to.have.property('message');
            }
        });
    });

    describe('Start Game', () => {
        let getLobbyStub;
        let createGameStub;

        before(() => {
            getLobbyStub = sinon.stub(lobbyModule, 'getLobby');
            createGameStub = sinon.stub(gameModule, 'createGame');
        });

        beforeEach(() => {
            getLobbyStub.reset();
            createGameStub.reset();
        });

        after(() => {
            getLobbyStub.restore();
            createGameStub.restore();
        });

        it('Should start game for lobby', async () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                players: ['testPlayer1', 'testPlayer2'],
                state: 'WAIT',
            };

            getLobbyStub.returns(lobbyObj);
            createGameStub.returns('sampleGameUuid');

            const result = lobbyModule.startGame(lobbyObj.uuid);

            expect(result).to.equal('sampleGameUuid');

            expect(lobbyObj.state).to.equal('TERMINATING');
            expect(lobbyObj.gameId).to.equal('sampleGameUuid');

            expect(getLobbyStub.calledOnce).to.equal(true);
            expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);

            expect(createGameStub.calledOnce).to.equal(true);
            expect(createGameStub.calledWith(lobbyObj.players)).to.equal(true);
        });

        it('Should throw an error when lobby was not found', async () => {
            getLobbyStub.returns();

            try {
                lobbyModule.startGame();
            } catch (err) {
                expect(getLobbyStub.calledOnce).to.equal(true);

                expect(err.code).to.equal(404);
                expect(err.message).to.equal('Lobby not found');
            }
        });

        it('Should throw an error when lobby has not enough players', async () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                players: ['testPlayer1'],
                state: 'WAIT',
            };

            getLobbyStub.returns(lobbyObj);

            try {
                lobbyModule.startGame(lobbyObj.uuid);
            } catch (err) {
                expect(getLobbyStub.calledOnce).to.equal(true);
                expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);

                expect(err.code).to.equal(400);
                expect(err.message).to.equal('Not enough players');
            }
        });
    });

    describe('Add Player To Lobby', () => {
        let getLobbyStub;

        before(() => {
            getLobbyStub = sinon.stub(lobbyModule, 'getLobbyInternal');
        });

        beforeEach(() => {
            getLobbyStub.reset();
        });

        after(() => {
            getLobbyStub.restore();
        });

        it('Should add a player to the lobby', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                players: ['testPlayer1'],
                state: 'WAIT',
            };

            const playerToAdd = {
                username: 'playerToAdd',
            };

            getLobbyStub.returns(lobbyObj);

            const result = lobbyModule.addPlayerToLobby(playerToAdd, lobbyObj.uuid);

            expect(result).to.equal(true);

            expect(getLobbyStub.calledOnce).to.equal(true);
            expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);

            expect(lobbyObj.players.length).to.equal(2);
            expect(lobbyObj.players[1]).to.equal(playerToAdd);
        });

        it('Should add a player to the secure lobby', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                password: 'testMe',
                players: ['testPlayer1'],
                state: 'WAIT',
            };

            const playerToAdd = {
                username: 'playerToAdd',
            };

            getLobbyStub.returns(lobbyObj);

            const result = lobbyModule.addPlayerToLobby(playerToAdd, lobbyObj.uuid, 'testMe');

            expect(result).to.equal(true);

            expect(getLobbyStub.calledOnce).to.equal(true);
            expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);

            expect(lobbyObj.players.length).to.equal(2);
            expect(lobbyObj.players[1]).to.equal(playerToAdd);
        });

        it('Should throw an error when lobby was not found', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                password: 'testMe',
                players: ['testPlayer1'],
                state: 'WAIT',
            };

            const playerToAdd = {
                username: 'playerToAdd',
            };

            getLobbyStub.returns();

            try {
                lobbyModule.addPlayerToLobby(playerToAdd, lobbyObj.uuid, 'testMe');
            } catch (err) {
                expect(err.code).to.equal(404);
                expect(err.message).to.equal('Lobby not found');

                expect(getLobbyStub.calledOnce).to.equal(true);
                expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);
            }
        });

        it('Should throw an error when passwords do not match', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                password: 'testMe',
                players: ['testPlayer1'],
                state: 'WAIT',
            };

            const playerToAdd = {
                username: 'playerToAdd',
            };

            getLobbyStub.returns(lobbyObj);

            try {
                lobbyModule.addPlayerToLobby(playerToAdd, lobbyObj.uuid, 'wrongPassword');
            } catch (err) {
                expect(err.code).to.equal(401);
                expect(err.message).to.equal('Wrong password');
            }
        });
    });

    describe('Remove Player From Lobby', () => {
        let getLobbyStub;

        before(() => {
            getLobbyStub = sinon.stub(lobbyModule, 'getLobby');
        });

        beforeEach(() => {
            getLobbyStub.reset();
        });

        after(() => {
            getLobbyStub.restore();
        });

        it('Should remove player from the lobby', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                players: [
                    {
                        username: 'testPlayer1',
                    },
                    {
                        username: 'testPlayer2',
                    },
                ],
                state: 'WAIT',
            };

            const playerInfo = {
                username: 'testPlayer2',
            };

            getLobbyStub.returns(lobbyObj);

            const result = lobbyModule.removePlayerFromLobby(playerInfo, lobbyObj.uuid);

            expect(result).to.equal(true);

            expect(getLobbyStub.calledOnce).to.equal(true);
            expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);

            expect(lobbyObj.players.length).to.equal(1);
        });

        it('Should throw an error when lobby was not found', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                players: [
                    {
                        username: 'testPlayer1',
                    },
                    {
                        username: 'testPlayer2',
                    },
                ],
                state: 'WAIT',
            };

            const playerInfo = {
                username: 'testPlayer2',
            };

            getLobbyStub.returns();

            try {
                lobbyModule.removePlayerFromLobby(playerInfo, lobbyObj.uuid);
            } catch (err) {
                expect(err.code).to.equal(404);
                expect(err.message).to.equal('Lobby not found');

                expect(getLobbyStub.calledOnce).to.equal(true);
                expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);
            }
        });

        it('Should throw an error when player was not found', () => {
            const lobbyObj = {
                uuid: 'sampleUuid',
                type: 'any',
                players: [
                    {
                        username: 'testPlayer1',
                    },
                ],
                state: 'WAIT',
            };

            const playerInfo = {
                username: 'testPlayer2',
            };

            getLobbyStub.returns(lobbyObj);

            try {
                lobbyModule.removePlayerFromLobby(playerInfo, lobbyObj.uuid);
            } catch (err) {
                expect(err.code).to.equal(404);
                expect(err.message).to.equal('Player not found');

                expect(getLobbyStub.calledOnce).to.equal(true);
                expect(getLobbyStub.calledWith(lobbyObj.uuid)).to.equal(true);
            }
        });
    });
});

