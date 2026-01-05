const db = require('../data/db');

const getCities = (req, reply) => {
    const cities = db.prepare(
        'SELECT * FROM cities'
    ).all();
    reply.send(cities);
};


const getCity = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM cities WHERE id = ?'
    ).get(id);

    if (!item) {
        return reply.status(404).send({ message: 'Item not found' });
    }

    reply.send(item);
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

    reply.send(cities);
}


const addCity = (req, reply) => {
    const { name, region_id } = req.body;

    const result = db
        .prepare('INSERT INTO cities (name, region_id) VALUES (?, ?)')
        .run(name, region_id);
    
    reply.code(201).send({
        id: result.lastInsertRowid,
        name,
        region_id
    });
};

module.exports = {getCities, getCity, getCitiesByRegion, addCity};