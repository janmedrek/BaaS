const authModule = {};

authModule.authenticateUser = (req) => {
    if (req) {
        return true;
    }
    return false;
};

module.exports = authModule;
