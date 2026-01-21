const fastify = require('fastify')({ logger: true });
const PORT = 5000;

fastify.register(require('@fastify/swagger'), {
    swagger: {
        info: {
            title: 'Marketplace API',
            description: 'API documentation',
            version: '1.0.0'
        },
        securityDefinitions: {
            BearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'Введите: Bearer <JWT>'
            }
        }
    }
});

fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    exposeRoute: true
});

fastify.register(require('@fastify/cors'), {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

fastify.register(require('@fastify/multipart'), {
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB (по желению)
    }
});

fastify.register(require('@fastify/static'), {
    root: require('path').join(__dirname, 'uploads'),
    prefix: '/uploads/'
});

fastify.register(require('@fastify/jwt'), {
    secret: 'supersecret'
});

fastify.decorate('authenticate', async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({
            code: -5,
            message: 'Unauthorized'
        });
    }
});

fastify.register(require('./routes/companies.js'));
fastify.register(require('./routes/categories.js'));
fastify.register(require('./routes/tags.js'));
fastify.register(require('./routes/regions.js'));
fastify.register(require('./routes/cities.js'));
fastify.register(require('./routes/users.js'));
fastify.register(require('./routes/genders.js'));
fastify.register(require('./routes/login.js'));
fastify.register(require('./routes/social-media.js'));
fastify.register(require('./routes/files.js'));

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();