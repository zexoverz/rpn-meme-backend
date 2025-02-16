const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postController = require('../../controllers/post.controller');
const postValidation = require('../../validations/post.validation')
const router = express.Router();

router
  .route('/')
  .get( validate(postValidation.getPosts), postController.getPosts)
  .post(auth(), validate(postValidation.createPost), postController.createPost)


module.exports = router;