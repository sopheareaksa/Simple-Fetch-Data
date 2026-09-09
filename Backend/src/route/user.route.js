var {login} = require('../controller/user.controller');
const { validate_token } = require('../middleware/auth');

const userRoute = (app) => {
    app.post('/api/v1/user/login', login);
}

module.exports = userRoute
