const db = require('../data/db');

const getUsers = (req, reply) => {
    const users = db.prepare(
        'SELECT * FROM users'
    ).all();
    reply.send(users);
};


const getUser = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM users WHERE id = ?'
    ).get(id);

    if (!item) {
        return reply.status(404).send({ message: 'Item not found' });
    }

    reply.send(item);
};


const addUser = (req, reply) => {
    const { username, password, first_name, last_name, phone_number, gender_id } = req.body;

    const genderExists = db
        .prepare('SELECT 1 FROM genders WHERE id = ?')
        .get(gender_id);

    if (!genderExists) {
        return reply.code(400).send({
            message: 'Invalid gender_id'
        });
    }

    const result = db
        .prepare('INSERT INTO users (username, password, first_name, last_name, phone_number, gender_id) VALUES (?, ?, ?, ?, ?, ?)')
        .run(username, password, first_name, last_name, phone_number, gender_id);
    
    reply.code(201).send({
        user_id: result.lastInsertRowid,
        username,
        first_name,
        last_name,
        phone_number,
        gender_id
    });
};

module.exports = {getUsers, getUser, addUser};