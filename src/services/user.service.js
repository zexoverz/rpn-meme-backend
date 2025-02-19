const {status} = require('http-status');
const prisma = require('../../prisma')
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  userBody.password = bcrypt.hashSync(userBody.password, 8);

  return prisma.user.create({
    data: userBody
  });
};

/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async ({ page, limit = 9 }) => {
  const cursor = page && typeof page === 'string' ? { id: page } : undefined;

  const users = await prisma.user.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor,
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      imageId: true,
      email: true,
      role: true,
      createdAt: true,
      updateAt: true,
      isEmailVerified: true,
      _count: {
        select: {
          posts: true
        }
      }
    }
  });

  // Transform the response to flatten _count
  const transformedUsers = users.map(user => ({
    ...user,
    totalPosts: user._count.posts,
    _count: undefined
  }));

  return transformedUsers;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return prisma.user.findFirst({
    where: {
      id: id
    }
  })
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }
  
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateBody
  })

  return updateUser;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  const deleteUsers = await prisma.user.deleteMany({
    where: {
      id: userId
    },
  })

  return deleteUsers;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
