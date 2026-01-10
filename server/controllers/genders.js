const db = require('../data/db');
const { sendResponse } = require('../utils/response');

const getGenders = (req, reply) => {
    const genders = db.prepare(
        'SELECT * FROM genders'
    ).all();
    return sendResponse(reply, 200, 0, 'OK', genders);
};


const getGender = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM genders WHERE id = ?'
    ).get(id);

    if (!item) return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'Gender not found');

    return sendResponse(reply, 200, 0, 'OK', item);
};


const addGender = (req, reply) => {
    const { name } = req.body;

    const result = db
        .prepare('INSERT INTO genders (name) VALUES (?)')
        .run(name);
    
        return sendResponse(reply, 201, 0, 'CREATED', { id: result.lastInsertRowid, name });
};

module.exports = {getGenders, getGender, addGender};