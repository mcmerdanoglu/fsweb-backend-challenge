const db = require("../../data/dbConfig");

async function getAllPosts() {
  return await db("posts");
}

async function getPostById(postId) {
  return await db("posts").where({ post_id: postId }).first();
}

async function addPost(post) {
  const [addedPost] = await db("posts").insert(post);
  return getPostById(addedPost);
}

// async function addPost(insertedPost) {
//   await db("posts").insert(insertedPost);
//   return getPostById(postId);
// }

async function updatePost(postId, updatedPost) {
  return await db("posts").where({ post_id: postId }).update(updatedPost);
  //   const changedPost = await db("posts").where({ post_id: postId }).first();
  //   return changedPost;
}

async function deletePost(postId) {
  return await db("posts").where({ post_id: postId }).del();
  //   const deletedPost = await db("posts").where({ post_id: postId }).first();
  //   return deletedPost;
}

module.exports = {
  getAllPosts,
  getPostById,
  addPost,
  updatePost,
  deletePost,
};
