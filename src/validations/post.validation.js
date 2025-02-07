const Joi = require('joi');

const createPost = {
    body: Joi.object().keys({
      caption: Joi.string(),
      imageUrl: Joi.string(),
      imageId: Joi.string(),
      location: Joi.string(),
      tags: Joi.array()
    }),
};

const getPosts = {
    query: Joi.object().keys({
        page: Joi.number().integer(),
        limit: Joi.number().integer(),
    }),
};

module.exports = {
    getPosts,
    createPost
};