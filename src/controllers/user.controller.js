const {status} = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getUsers = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await userService.queryUsers({page, limit});
  
  res.status(status.OK).send({
    status: status.OK,
    message: "Get Users Success",
    data: result
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }
  
  res.status(status.OK).send({
    status: status.OK,
    message: "Get User Success",
    data: user
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  
  res.status(status.OK).send({
    status: status.OK,
    message: "Update User Success",
    data: user
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.user.id);
  
  res.status(status.OK).send({
    status: status.OK,
    message: "Delete User Success",
    data: null
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
