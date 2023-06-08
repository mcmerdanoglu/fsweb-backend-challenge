// const express = require("express");
// const router = express.Router();
const router = require("express").Router();
const postsModel = require("./posts-model");
const restrict = require("../auth/restricted");
const { checkPost } = require("./posts-middleware");

router.get("/", async (req, res) => {
  try {
    const posts = await postsModel.getAllPosts();
    const sortedPosts = posts
      .sort((a, b) => b.created_at - a.created_at)
      .reverse();
    res.json(sortedPosts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gönderiler getirilirken bir hata oluştu." });
  }
});

router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postsModel.getPostById(postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Gönderi bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi getirilirken bir hata oluştu." });
  }
});

router.post("/", restrict, checkPost, async (req, res) => {
  const { post_content } = req.body;
  const post = {
    post_content: post_content,
    user_id: req.decodedToken.user_id,
  };
  try {
    const newPost = await postsModel.addPost(post);
    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "İçerik gönderilirken bir hata oluştu.", error });
  }
});

router.put("/:id", restrict, checkPost, async (req, res) => {
  const postId = req.params.id;
  const { post_content } = req.body;
  const { user_id } = req.decodedToken.user_id;
  const post = { post_content: post_content, user_id };

  try {
    const updatedPost = await postsModel.updatePost(postId, post);
    if (updatedPost) {
      const newUpdatedPost = await postsModel.getPostById(postId);
      res.status(200).json(newUpdatedPost);
    } else {
      res.status(404).json({ message: "Gönderi bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "İçerik güncellenirken bir hata oluştu." });
  }
});

router.delete("/:id", restrict, async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPost = await postsModel.deletePost(postId);
    if (deletedPost) {
      res.json({ message: "Gönderi başarıyla silindi." });
    } else {
      res.status(404).json({ message: "Gönderi bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinirken bir hata oluştu." });
  }
});

module.exports = router;
