const prisma = require("../../prisma");

 const createPost = async (post) => {
    try {
  
      const newPost = await prisma.post.create({
        data: {
          caption: post.caption,
          imageUrl: post.imageUrl,
          imageId: post.imageId,
          location: post.location,
          tags: post.tags,
          creatorId: post.userId
        },
        include: {
          creator: true,
          likes: true
        }
      });
  
      return newPost;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
 const getInfinitePosts = async ({ page, limit = 9 }) => {
    try {

      const cursor = page && typeof page === 'string' ? { id: page } : undefined;

      const posts = await prisma.post.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          creator: true,
          likes: true,
          saves: true
        }
      });
  
      return posts;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  const getSavedPost = async ({ userId, page, limit = 9 }) => {
    try {
      const cursor = page && typeof page === 'string' ? { id: page } : undefined;
  
      const savedPosts = await prisma.save.findMany({
        where: {
          userId: userId
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          post: {
            include: {
              creator: true,
              likes: true,
              saves: true
            }
          }
        }
      });
  
      // Transform the data to match the posts structure
      const posts = savedPosts.map(save => save.post);
  
      return posts;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  const likePost = async (userId, postId) => {
    try {
      const like = await prisma.like.create({
        data: {
          userId,
          postId
        }
      });
  
      return like;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
 const unlikePost = async (userId, postId) => {
    try {
      const unlike = await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });
  
      return unlike;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
 const savePost = async (userId, postId) => {
    try {
      const save = await prisma.save.create({
        data: {
          userId,
          postId
        }
      });
  
      return save;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
 const unsavePost = async (userId, postId) => {
    try {
      const unsave = await prisma.save.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });
  
      return unsave;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
 const updatePost = async (post) => {
    try {
      const updatedPost = await prisma.post.update({
        where: { id: post.postId },
        data: {
          caption: post.caption,
          imageUrl: post.imageUrl,
          imageId: post.imageId,
          location: post.location,
          tags: post.tags?.replace(/ /g, "").split(",") || []
        }
      });
  
      return updatedPost;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const searchPost = async ({ searchQuery, page, limit = 9 }) => {
    try {
      const cursor = page && typeof page === 'string' ? { id: page } : undefined;
  
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              caption: {
                contains: searchQuery,
                mode: 'insensitive'  // Case-insensitive search
              }
            },
            {
              location: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            },
            {
              tags: {
                has: searchQuery  // Search in array of tags
              }
            },
            {
              creator: {
                name: {
                  contains: searchQuery,
                  mode: 'insensitive'
                }
              }
            }
          ]
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          creator: true,
          likes: true,
          saves: true
        }
      });
  
      return posts;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  const getTopLikedPost = async () => {
    try {
      const posts = await prisma.post.findMany({
        take: 10,
        orderBy: {
          likes: {
            _count: 'desc'
          }
        },
        include: {
          creator: true,
          likes: true,
          saves: true,
          _count: {
            select: {
              likes: true,
              saves: true
            }
          }
        }
      });
  
      // Transform the response to include like counts directly
      const transformedPosts = posts.map(post => ({
        ...post,
        totalLikes: post._count.likes,
        totalSaves: post._count.saves,
        _count: undefined
      }));
  
      return transformedPosts;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  


module.exports = {
    createPost,
    getInfinitePosts,
    likePost,
    unlikePost,
    savePost,
    unsavePost,
    updatePost,
    getSavedPost,
    searchPost,
    getTopLikedPost
}