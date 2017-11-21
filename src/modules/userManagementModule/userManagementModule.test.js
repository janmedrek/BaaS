// ESLint parser variables (so it does not highligh mocha functions)
/* global describe before beforeEach after it */

const expect = require('chai').expect;
const sinon = require('sinon');

const userManagementModule = require('./userManagementModule');
const datastoreFacade = require('../datastoreFacade/datastoreFacade');

describe('User Management Module', () => {
    describe('Register User', () => {
        let datastoreFacadeGetUserStub;
        let datastoreFacadeSaveUserStub;

        before(() => {
            datastoreFacadeGetUserStub = sinon.stub(datastoreFacade, 'getUser');
            datastoreFacadeSaveUserStub = sinon.stub(datastoreFacade, 'saveUser');
        });

        beforeEach(() => {
            datastoreFacadeGetUserStub.reset();
            datastoreFacadeSaveUserStub.reset();
        });

        after(() => {
            datastoreFacadeGetUserStub.restore();
            datastoreFacadeSaveUserStub.restore();
        });

        it('Should register user', async () => {
            const user = {
                username: 'testUser',
                password: 'testPassword',
            };

            datastoreFacadeGetUserStub.returns();
            datastoreFacadeSaveUserStub.returns(true);

            const result = await userManagementModule.registerUser(user.username, user.password);

            expect(result).to.equal(true);

            expect(datastoreFacadeGetUserStub.calledOnce).to.equal(true);
            expect(datastoreFacadeGetUserStub.calledWith(user.username)).to.equal(true);

            expect(datastoreFacadeSaveUserStub.calledOnce).to.equal(true);

            const call = datastoreFacadeSaveUserStub.getCall(0);

            expect(datastoreFacadeSaveUserStub
                .calledWith(user.username, call.args[1], call.args[2]))
                .to.equal(true);
        });

        it('Should throw an error when not enough data', async () => {
            try {
                await userManagementModule.registerUser();
            } catch (err) {
                expect(err.code).to.equal(400);
                expect(err.message).to.equal('Not enough information');

                expect(datastoreFacadeGetUserStub.called).to.equal(false);
                expect(datastoreFacadeSaveUserStub.called).to.equal(false);
            }
        });

        it('Should throw an error on username conflict', async () => {
            const user = {
                username: 'testUser',
                password: 'testPassword',
            };

            datastoreFacadeGetUserStub.returns(true);

            try {
                await userManagementModule.registerUser(user.username, user.password);
            } catch (err) {
                expect(err.code).to.equal(409);
                expect(err.message).to.equal('User with that name already exists');
            }
        });
    });
});
