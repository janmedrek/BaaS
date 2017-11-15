// ESLint parser variables (so it does not highligh mocha functions)
/* global describe before beforeEach after it */

const expect = require('chai').expect;
const sinon = require('sinon');

const base64 = require('base-64');
const md5 = require('md5');

const authModule = require('./authModule');
const datastoreFacade = require('../datastoreFacade/datastoreFacade');

describe('Authentication Module', () => {
    describe('Authenticate User', () => {
        let getUserStub;

        before(() => {
            getUserStub = sinon.stub(datastoreFacade, 'getUser');
        });

        beforeEach(() => {
            getUserStub.reset();
        });

        after(() => {
            getUserStub.restore();
        });

        it('Should authenticate user on proper request', async () => {
            const credentials = {
                username: 'testUser',
                password: 'testPassword',
            };

            const salt = 'abcdefgh';

            const testObj = {
                headers: {
                    authorization: `Bearer ${base64.encode(`${credentials.username}:${credentials.password}`)}`,
                },
            };

            const userData = {
                passwordHash: md5(`${credentials.password}${salt}`),
                passwordSalt: salt,
            };

            getUserStub.returns(userData);

            const result = await authModule.authenticateUser(testObj);

            expect(result).to.equal('testUser');

            expect(getUserStub.called).to.equal(true);
            expect(getUserStub.calledOnce).to.equal(true);
            expect(getUserStub.calledWith(credentials.username)).to.equal(true);
        });

        it('Should return false on bad request', async () => {
            const result = await authModule.authenticateUser();

            expect(result).to.equal(false);

            expect(getUserStub.called).to.equal(false);
        });

        it('Should return false on invalid user', async () => {
            const credentials = {
                username: 'testUser',
                password: 'testPassword',
            };

            const testObj = {
                headers: {
                    authorization: `Bearer ${base64.encode(`${credentials.username}:${credentials.password}`)}`,
                },
            };

            getUserStub.returns();

            const result = await authModule.authenticateUser(testObj);

            expect(result).to.equal(false);

            expect(getUserStub.called).to.equal(true);
            expect(getUserStub.calledOnce).to.equal(true);
            expect(getUserStub.calledWith(credentials.username)).to.equal(true);
        });

        it('Should return false on invalid user/password combination', async () => {
            const credentials = {
                username: 'testUser',
                password: 'testPassword',
            };

            const salt = 'abcdefgh';

            const testObj = {
                headers: {
                    authorization: `Bearer ${base64.encode(`${credentials.username}:${credentials.password}`)}`,
                },
            };

            const userData = {
                passwordHash: md5(`differentPassword${salt}`),
                passwordSalt: salt,
            };

            getUserStub.returns(userData);

            const result = await authModule.authenticateUser(testObj);

            expect(result).to.equal(false);

            expect(getUserStub.called).to.equal(true);
            expect(getUserStub.calledOnce).to.equal(true);
            expect(getUserStub.calledWith(credentials.username)).to.equal(true);
        });
    });
});

