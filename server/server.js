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

fastify.register(require('@fastify/cors'), {
    origin: 'http://localhost:4200'
});

fastify.register(require('./routes/companies.js'));
fastify.register(require('./routes/categories.js'));
fastify.register(require('./routes/tags.js'));
fastify.register(require('./routes/regions.js'));
fastify.register(require('./routes/cities.js'));
fastify.register(require('./routes/users.js'));
fastify.register(require('./routes/genders.js'));

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();