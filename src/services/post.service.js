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
      const cursor = page && page !== '' ? { id: page } : undefined;
      
      const fetchLimit = parseInt(limit) + 1;
      
      const posts = await prisma.post.findMany({
        take: fetchLimit,
        skip: cursor ? 1 : 0, // Skip the cursor item if we have one
        cursor: cursor,
        orderBy: {
          createdAt: 'desc'
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
      
      const hasNextPage = posts.length > limit;
      
      const paginatedPosts = hasNextPage ? posts.slice(0, limit) : posts;
      
      const nextCursor = hasNextPage ? paginatedPosts[paginatedPosts.length - 1].id : null;
      
      const transformedPosts = paginatedPosts.map(post => ({
        ...post,
        totalLikes: post._count.likes,
        totalSaves: post._count.saves,
        _count: undefined
      }));
      
      return {
        posts: transformedPosts,
        pagination: {
          nextCursor,
          hasNextPage
        }
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  const getSavedPost = async ({ userId, page, limit = 9 }) => {
    try {
      const cursor = page && page !== '' ? { id: page } : undefined;
      
      const fetchLimit = parseInt(limit) + 1;
    
      const savedPosts = await prisma.save.findMany({
        where: {
          userId: userId
        },
        take: fetchLimit,
        skip: cursor ? 1 : 0, // Skip the cursor item if we have one
        cursor: cursor,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          post: {
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
          }
        }
      });
      
      // Check if we have more results
      const hasNextPage = savedPosts.length > limit;
      
      // Remove the extra item we fetched to check for more pages
      const paginatedSavedPosts = hasNextPage ? savedPosts.slice(0, limit) : savedPosts;
      
      // Get the ID of the last save to use as the next cursor
      const nextCursor = hasNextPage && paginatedSavedPosts.length > 0 
        ? paginatedSavedPosts[paginatedSavedPosts.length - 1].id 
        : null;
      
      // Transform the data to include posts with counts
      const posts = paginatedSavedPosts.map(save => ({
        ...save.post,
        totalLikes: save.post._count.likes,
        totalSaves: save.post._count.saves,
        _count: undefined
      }));
      
      // Return both the posts and pagination information
      return {
        posts: posts,
        pagination: {
          nextCursor,
          hasNextPage
        }
      };
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
      const cursor = page && page !== '' ? { id: page } : undefined;
      
      const fetchLimit = parseInt(limit) + 1;
    
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
        take: fetchLimit,
        skip: cursor ? 1 : 0, // Skip the cursor item if we have one
        cursor: cursor,
        orderBy: {
          createdAt: 'desc'
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
      
      // Check if we have more results
      const hasNextPage = posts.length > limit;
      
      // Remove the extra item we fetched to check for more pages
      const paginatedPosts = hasNextPage ? posts.slice(0, limit) : posts;
      
      // Get the ID of the last post to use as the next cursor
      const nextCursor = hasNextPage && paginatedPosts.length > 0 
        ? paginatedPosts[paginatedPosts.length - 1].id 
        : null;
      
      // Transform posts to include counts
      const transformedPosts = paginatedPosts.map(post => ({
        ...post,
        totalLikes: post._count.likes,
        totalSaves: post._count.saves,
        _count: undefined
      }));
      
      // Return both the posts and pagination information
      return {
        posts: transformedPosts,
        pagination: {
          nextCursor,
          hasNextPage
        }
      };
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