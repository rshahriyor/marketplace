const { login } = require('../controllers/login');
const { responseSchema } = require('../utils/response');

const loginSchema = {
    type: 'object',
    properties: {
        code: { type: 'number' },
        token: { type: 'string' },
        message: { type: 'string' }
    }
};

const loginOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' }
            },
            required: ['username', 'password']
        },
        response: {
            201: responseSchema(loginSchema)
        }
    },
    handler: login
};

function itemRoutes(fastify, options, done) {
    fastify.post('/login', loginOpts);
    done();
};

module.exports = itemRoutes;