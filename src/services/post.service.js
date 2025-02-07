const prisma = require("../../prisma");

 const createPost = async (post) => {
    try {
  
      const newPost = await prisma.post.create({
        data: {
          caption: post.caption,
          imageUrl: post.imageUrl,
          imageId: post.imageId,
          location: post.location,
          tags: post.tags?.replace(/ /g, "").split(",") || [],
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
  
 const getInfinitePosts = async ({ pageParam, limit = 9 }) => {
    try {
      const posts = await prisma.post.findMany({
        take: limit,
        skip: pageParam ? 1 : 0,
        cursor: pageParam ? { id: pageParam } : undefined,
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


module.exports = {
    createPost,
    getInfinitePosts,
    likePost,
    unlikePost,
    savePost,
    unsavePost,
    updatePost
}