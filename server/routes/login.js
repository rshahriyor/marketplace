const { login } = require('../controllers/login');

const loginSchema = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        token: { type: 'string' }
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
            201: loginSchema
        }
    },
    handler: login
};

function itemRoutes(fastify, options, done) {
    fastify.post('/login', loginOpts);
    done();
};

module.exports = itemRoutes;