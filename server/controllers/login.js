const db = require('../data/db');

function login(req, reply) {
    const { username, password } = req.body;

    const user = db
        .prepare('SELECT * FROM users WHERE username = ? AND password = ?')
        .get(username, password);

    if (!user) {
        return reply.code(401).send({
            code: 401,
            message: 'Неверные данные'
        });
    }

    const token = this.jwt.sign(
        { userId: user.user_id },
        { expiresIn: '1h' }
    );

    return reply.code(201).send({
        code: 0,
        token
    });
}

module.exports = { login };