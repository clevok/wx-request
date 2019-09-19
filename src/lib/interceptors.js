const concat = require('./concat');

const interceptors = {
    request: new concat(),
    response: {
        success: new concat(),
        fail: new concat()
    }
};

module.exports = interceptors;