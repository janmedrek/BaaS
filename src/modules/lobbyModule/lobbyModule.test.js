// ESLint parser variables (so it does not highligh mocha functions)
/* global describe before beforeEach after it */

const expect = require('chai').expect;
const sinon = require('sinon');

const lobbyModule = require('./lobbyModule');

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
        it('Should start game for lobby', () => {

        });

        it('Should throw an error when lobby was not found', () => {

        });

        it('Should throw an error when lobby has not enough players', () => {

        });
    });

    describe('Add Player To Lobby', () => {
        it('Should add a player to the lobby', () => {

        });

        it('Should add a player to the secure lobby', () => {

        });

        it('Should throw an error when lobby was not found', () => {

        });

        it('Should throw an error when passwords do not match', () => {

        });
    });

    describe('Remove Player From Lobby', () => {
        it('Should remove player from the lobby', () => {

        });

        it('Should throw an error when lobby was not found', () => {

        });

        it('Should throw an error when player was not found', () => {

        });
    });
});

