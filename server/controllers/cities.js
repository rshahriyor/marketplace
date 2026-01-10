const db = require('../data/db');
const { sendResponse } = require('../utils/response');

const getCities = (req, reply) => {
    const cities = db.prepare(
        'SELECT * FROM cities'
    ).all();
    return sendResponse(reply, 200, 0, 'OK', cities);
};


const getCity = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM cities WHERE id = ?'
    ).get(id);

    if (!item) {
        return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'City not found');
    }

    return sendResponse(reply, 200, 0, 'OK', item);
};


const getCitiesByRegion = (req, reply) => {
    const { region_id } = req.query;

    const cities = region_id
        ? db.prepare(
            'SELECT * FROM cities WHERE region_id = ?'
        ).all(region_id)
        : db.prepare(
            'SELECT * FROM cities'
        ).all();

    return sendResponse(reply, 200, 0, 'OK', cities);
}


const addCity = (req, reply) => {
    const { name, region_id } = req.body;

    const result = db
        .prepare('INSERT INTO cities (name, region_id) VALUES (?, ?)')
        .run(name, region_id);

    return sendResponse( reply, 201, 0, 'CREATED', { id: result.lastInsertRowid, name, region_id });
};

module.exports = { getCities, getCity, getCitiesByRegion, addCity };