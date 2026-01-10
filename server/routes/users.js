const {getUsers, getUser, addUser} = require('../controllers/users');
const { responseSchema } = require('../utils/response');

const userSchema = {
    type: 'object',
    properties: {
        user_id: { type: 'number' },
        username: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        phone_number: { type: 'number' },
        gender_id: { type: 'number' },
        gender_name: { type: 'string' }
    }
};

const getUsersOpts = {
    schema: {
        response: {
            200: responseSchema({
                type: 'array',
                items: userSchema
            })
        }
    },
    handler: getUsers
};

const getUserOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: responseSchema(userSchema)
        }
    },
    handler: getUser
};

const postUserOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                phone_number: { type: 'number' },
                gender_id: { type: 'number' }
            },
            required: ['username', 'password', 'first_name', 'last_name', 'phone_number', 'gender_id']
        },
        response: {
            201: responseSchema(userSchema)
        }
    },
    handler: addUser
};

function itemRoutes(fastify, options, done) {
    fastify.get('/users', getUsersOpts);
    fastify.post('/users', postUserOpts)
    done();
};

module.exports = itemRoutes;