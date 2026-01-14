const db = require('../data/db');
const { sendResponse } = require('../utils/response');

const getSocialMediaList = (req, reply) => {
    const social_media = db.prepare(
        'SELECT * FROM social_media'
    ).all();
    return sendResponse(reply, 200, 0, 'OK', social_media);
};


const getSocialMedia = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM social_media WHERE id = ?'
    ).get(id);

    if (!item) return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'User not found');

    return sendResponse(reply, 200, 0, 'OK', item);
};


const addSocialMedia = (req, reply) => {
    const { name } = req.body;

    const result = db
        .prepare('INSERT INTO social_media (name) VALUES (?)')
        .run(name);
    
    return sendResponse(reply, 201, 0, 'CREATED', { id: result.lastInsertRowid, name });
};

module.exports = {getSocialMediaList, getSocialMedia, addSocialMedia};