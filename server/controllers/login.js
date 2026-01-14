const db = require('../data/db');
const { sendResponse } = require('../utils/response');

function login(req, reply) {
    const { username, password } = req.body;

    const user = db
        .prepare('SELECT * FROM users WHERE username = ? AND password = ?')
        .get(username, password);

    if (!user) return sendResponse(reply, 201, -3, 'UNAUTHORIZED', null, 'Неверные данные');

    const token = this.jwt.sign(
        { userId: user.user_id },
        { expiresIn: '3d' }
    );

    return sendResponse(reply, 201, 0, 'OK', { token });
}

module.exports = { login };