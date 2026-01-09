const db = require('../data/db');

function login(req, reply) {
    const { username, password } = req.body;

    const user = db
        .prepare('SELECT * FROM users WHERE username = ? AND password = ?')
        .get(username, password);

    if (!user) {
        return reply.status(401).send({ message: 'Неверные данные' });
    }

    const token = this.jwt.sign(
        { userId: user.user_id },
        { expiresIn: '3h' }
    );

    return reply.code(201).send({ token });
}

module.exports = { login };