const db = require("../../data/dbConfig");

async function getAllComments() {
  return await db("comments");
}

async function getCommentById(commentId) {
  return await db("comments").where({ comment_id: commentId }).first();
}

async function getCommentsByPostId(postId) {
  return await db("comments").where("post_id", postId).select("*");
}

// async function addComment (comment) {
//   const createdComment = await db("comments").insert(comment).returning("*");
//   return createdComment;
// };

async function addComment(comment) {
  const [addedComment] = await db("comments").insert(comment);
  return getCommentById(addedComment);
}

async function updateComment(commentId, updatedComment) {
  return await db("comments")
    .where({ comment_id: commentId })
    .update(updatedComment);
  //   const updated = await db("comments").where({ comment_id: commentId }).first();
  //   return updated;
}

async function deleteComment(commentId) {
  return await db("comments").where({ comment_id: commentId }).del();
  //   const deletedComment = await db("comments")
  //     .where({ comment_id: commentId })
  //     .first();
  //   return deletedComment;
}

module.exports = {
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  addComment,
  updateComment,
  deleteComment,
};
