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
  const { cursor, limit } = req.query;
  const result = await postService.getInfinitePosts({ 
    page: cursor, 
    limit 
  });

  res.status(status.OK).send({
    status: status.OK,
    message: "Get Posts Success",
    data: result.posts,
    pagination: result.pagination
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
  const { cursor, limit } = req.query;
  const result = await postService.getSavedPost({ 
    userId: req.user.id,
    page: cursor, // Use cursor instead of page for clarity
    limit 
  });

  res.status(status.OK).send({
    status: status.OK,
    message: "Get Saved Post Success",
    data: result.posts,
    pagination: result.pagination
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

const searchPost = catchAsync(async (req, res) => {
  const { q: searchQuery, cursor, limit } = req.query;

  if (!searchQuery) {
    throw new ApiError(status.BAD_REQUEST, 'Search query is required');
  }

  const result = await postService.searchPost({ 
    searchQuery, 
    page: cursor, // Use cursor instead of page for clarity 
    limit 
  });

  res.status(status.OK).send({
    status: status.OK,
    message: "Search Post Success",
    data: result.posts,
    pagination: result.pagination
  });
});

const getTopLikedPost = catchAsync(async (req, res) => {
  const posts = await postService.getTopLikedPost();

  res.status(status.OK).send({
    status: status.OK,
    message: "Get Top Liked Posts Success",
    data: posts
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
  getSavedPost,
  searchPost,
  getTopLikedPost
};