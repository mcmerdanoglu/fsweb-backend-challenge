const router = require("express").Router();
const commentsModel = require("./comments-model");
const restrict = require("../auth/restricted");
const { checkComment } = require("./comments-middleware");

router.get("/", async (req, res) => {
  try {
    const comments = await commentsModel.getAllComments();
    const sortedComments = comments
      .sort((a, b) => b.comment_time - a.comment_time)
      .reverse();
    res.json(sortedComments);
  } catch (error) {
    res.status(500).json({ message: "Yorumlar getirilirken bir hata oluştu." });
  }
});

router.get("/:id", async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await commentsModel.getCommentById(commentId);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ message: "Yorum bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Yorum getirilirken bir hata oluştu." });
  }
});

// Get all comments by post_id
router.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await commentsModel.getCommentsByPostId(postId);
    if (comments) {
      res.json(comments);
    } else {
      res.status(404).json({ message: "Yorumlar bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar getirilirken bir hata oluştu." });
  }
});

router.post("/", restrict, checkComment, async (req, res) => {
  const { comment_content } = req.body;
  const comment = {
    comment_content: comment_content,
    user_id: req.decodedToken.user_id,
    post_id: req.body.post_id,
  };
  try {
    const newComment = await commentsModel.addComment(comment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Yorum yaparken bir hata oluştu." });
  }
});

router.put("/:id", restrict, checkComment, async (req, res) => {
  const commentId = req.params.id;
  const { comment_content } = req.body;
  const comment = {
    comment_content: comment_content,
    user_id: req.decodedToken.user_id,
    post_id: req.body.post_id,
  };
  try {
    const updatedComment = await commentsModel.updateComment(
      commentId,
      comment
    );
    if (updatedComment) {
      const newUpdatedComment = await commentsModel.getCommentById(commentId);
      res.status(200).json(newUpdatedComment);
    } else {
      res.status(404).json({ message: "Yorum bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Yorum güncellenirken bir hata oluştu." });
  }
});

router.delete("/:id", restrict, async (req, res) => {
  const commentId = req.params.id;

  try {
    const deletedComment = await commentsModel.deleteComment(commentId);
    if (deletedComment) {
      res.json({ message: "Yorum başarıyla silindi." });
    } else {
      res.status(404).json({ message: "Yorum bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Yorum silinirken bir hata oluştu." });
  }
});

module.exports = router;
