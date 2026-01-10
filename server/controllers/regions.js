const db = require('../data/db');
const { sendResponse } = require('../utils/response');

const getRegions = (req, reply) => {
    const regions = db.prepare(
        'SELECT * FROM regions'
    ).all();
    return sendResponse(reply, 200, 0, 'OK', regions);
};


const getRegion = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM regions WHERE id = ?'
    ).get(id);

    if (!item) return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'Region not found');

    return sendResponse(reply, 200, 0, 'OK', item);
};


const addRegion = (req, reply) => {
    const { name } = req.body;

    const result = db
        .prepare('INSERT INTO regions (name) VALUES (?)')
        .run(name);
    
        return sendResponse(reply, 201, 0, 'CREATED', { id: result.lastInsertRowid, name });
};

module.exports = {getRegions, getRegion, addRegion};