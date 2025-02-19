const {status} = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost({
    ...req.body,
    userId: req.user.id
  });

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: "Create Post Success",
    data: post
  });
});

const getPosts = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const posts = await postService.getInfinitePosts({ page, limit });

  res.status(status.OK).send({
    status: status.OK,
    message: "Get Posts Success",
    data: posts
  });
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePost({
    ...req.body,
    postId: req.params.postId,
    userId: req.user.id
  });

  if (!post) {
    throw new ApiError(status.NOT_FOUND, 'Post not found');
  }

  res.status(status.OK).send({
    status: status.OK,
    message: "Update Post Success",
    data: post
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const post = await postService.getPostById(postId);

  if (!post) {
    throw new ApiError(status.NOT_FOUND, 'Post not found');
  }

  if (post.creatorId !== req.user.id) {
    throw new ApiError(status.FORBIDDEN, 'Not authorized to delete this post');
  }

  await postService.deletePost(postId, post.imageId);

  res.status(status.OK).send({
    status: status.OK,
    message: "Delete Post Success",
    data: null
  });
});

const likePost = catchAsync(async (req, res) => {
  const like = await postService.likePost(req.user.id, req.params.postId);

  res.status(status.OK).send({
    status: status.OK,
    message: "Like Post Success",
    data: like
  });
});

const unlikePost = catchAsync(async (req, res) => {
  const unlike = await postService.unlikePost(req.user.id, req.params.postId);

  res.status(status.OK).send({
    status: status.OK,
    message: "Unlike Post Success",
    data: unlike
  });
});

const savePost = catchAsync(async (req, res) => {
  const save = await postService.savePost(req.user.id, req.params.postId);

  res.status(status.OK).send({
    status: status.OK,
    message: "Save Post Success",
    data: save
  });
});

const getSavedPost = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const posts = await postService.getSavedPost({ 
    userId: req.user.id,
    page, 
    limit 
  });

  res.status(status.OK).send({
    status: status.OK,
    message: "Get Saved Posts Success",
    data: posts
  });
});

const unsavePost = catchAsync(async (req, res) => {
  const unsave = await postService.unsavePost(req.user.id, req.params.postId);

  res.status(status.OK).send({
    status: status.OK,
    message: "Unsave Post Success",
    data: unsave
  });
});

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getSavedPost
};