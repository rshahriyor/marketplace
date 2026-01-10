const db = require('../data/db');
const { sendResponse } = require('../utils/response');

const getUsers = (req, reply) => {
    const users = db.prepare(
        'SELECT * FROM users'
    ).all();
    return sendResponse(reply, 200, 0, 'OK', users);
};


const getUser = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM users WHERE id = ?'
    ).get(id);

    if (!item) return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'User not found');

    return sendResponse(reply, 200, 0, 'OK', item);
};


const addUser = (req, reply) => {
    const { username, password, first_name, last_name, phone_number, gender_id } = req.body;

    const genderExists = db
        .prepare('SELECT 1 FROM genders WHERE id = ?')
        .get(gender_id);

        if (!genderExists) return sendResponse(reply, 400, -1, 'BAD_REQUEST', null, 'Invalid gender_id');

    const result = db
        .prepare('INSERT INTO users (username, password, first_name, last_name, phone_number, gender_id) VALUES (?, ?, ?, ?, ?, ?)')
        .run(username, password, first_name, last_name, phone_number, gender_id);
    
    return sendResponse(reply, 201, 0, 'CREATED', {
        user_id: result.lastInsertRowid,
        username,
        first_name,
        last_name,
        phone_number,
        gender_id
    });
};

module.exports = {getUsers, getUser, addUser};