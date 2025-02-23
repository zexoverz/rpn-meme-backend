const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postController = require('../../controllers/post.controller');
const postValidation = require('../../validations/post.validation')
const router = express.Router();

router
  .route('/')
  .get(validate(postValidation.getPosts), postController.getPosts)
  .post(auth(), validate(postValidation.createPost), postController.createPost);

router
  .route('/:postId')
  .patch(auth(), validate(postValidation.updatePost), postController.updatePost)
  .delete(auth(), validate(postValidation.deletePost), postController.deletePost);

router
  .route('/:postId/like')
  .post(auth(), validate(postValidation.likePost), postController.likePost)
  .delete(auth(), validate(postValidation.unlikePost), postController.unlikePost);

router
  .route('/save')
  .get(auth(), validate(postValidation.getSavedPost), postController.getSavedPost)

router
  .route('/:postId/save')
  .post(auth(), validate(postValidation.savePost), postController.savePost)
  .delete(auth(), validate(postValidation.unsavePost), postController.unsavePost);

router
  .route('/search')
  .get(
    validate(postValidation.searchPost),
    postController.searchPost
  );

router
  .route('/leaderboard')
  .get(
    postController.getTopLikedPosts
  );

module.exports = router;