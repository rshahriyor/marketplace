const {getSocialMediaList, getSocialMedia, addSocialMedia} = require('../controllers/social-media');
const { responseSchema } = require('../utils/response');

const socialMediaSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' }
    }
};

const getSocialMediaListOpts = {
    schema: {
        response: {
            200: responseSchema({
                type: 'array',
                items: socialMediaSchema
            })
        }
    },
    handler: getSocialMediaList
};

const getSocialMediaOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: responseSchema(socialMediaSchema)
        }
    },
    handler: getSocialMedia
};

const postSocialMediaOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' }
            },
            required: ['name']
        },
        response: {
            201: responseSchema(socialMediaSchema)
        }
    },
    handler: addSocialMedia
};

function itemRoutes(fastify, options, done) {
    fastify.get('/social_media', getSocialMediaListOpts);
    fastify.post('/social_media', postSocialMediaOpts)
    done();
};

module.exports = itemRoutes;