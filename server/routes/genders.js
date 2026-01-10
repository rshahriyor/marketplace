const { getGenders, getGender, addGender } = require('../controllers/genders');
const { responseSchema } = require('../utils/response');

const genderSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' }
    }
};

const getGendersOpts = {
    schema: {
        response: {
            200: responseSchema({
                type: 'array',
                items: genderSchema
            })
        }
    },
    handler: getGenders
};

const getGenderOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: responseSchema(genderSchema)
        }
    },
    handler: getGender
};

const postGenderOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' }
            },
            required: ['name']
        },
        response: {
            201: responseSchema(genderSchema)
        }
    },
    handler: addGender
};

function itemRoutes(fastify, options, done) {
    fastify.get('/genders', getGenderOpts);
    fastify.post('/genders', postGenderOpts)
    done();
};

module.exports = itemRoutes;