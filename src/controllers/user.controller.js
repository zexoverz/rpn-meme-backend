const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');



const getUsers = catchAsync(async (req, res) => {
  const result = await userService.queryUsers();
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Users Success",
    data: result
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get User Success",
    data: user
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.userId, req.body);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Update User Success",
    data: user
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.user.userId);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
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
