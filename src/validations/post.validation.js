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

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    caption: Joi.string(),
    location: Joi.string(),
    tags: Joi.array()
  }),
};

const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

const likePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

const unlikePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

const savePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

const unsavePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost
};