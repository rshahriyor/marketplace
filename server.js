const fastify = require('fastify')({ logger: true });
const PORT = 5000;

fastify.register(require('@fastify/swagger'), {
    swagger: {
        info: {
            title: 'fastify-server',
            version: '1.0.0'
        }
    }
});

fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    exposeRoute: true
});

fastify.register(require('./routes/items.js'));

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();