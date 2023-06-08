//const express = require("express");
//const router = express.Router();
const router = require("express").Router();
const usersModel = require("./users-model");
const restrict = require("../auth/restricted");

router.get("/", async (req, res) => {
  try {
    const users = await usersModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcılar görüntülenirken bir hata oluştu." });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await usersModel.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Kayıtlı kullanıcı bulunamadı." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı görüntülenirken bir hata oluştu." });
  }
});

router.delete("/:id", restrict, async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await usersModel.deleteUser(userId);
    if (deletedUser) {
      res.json({ message: "Kullanıcı başarıyla silindi." });
    } else {
      res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinirken bir hata oluştu." });
  }
});

router.put("/:id", restrict, async (req, res) => {
  const userId = req.params.id;
  const { username, password, email } = req.body;
  const user = { username, password, email };

  try {
    const updatedUser = await usersModel.updateUser(userId, user);
    if (updatedUser) {
      const newUpdatedUser = await usersModel.getUserById(userId);
      res.status(200).json(newUpdatedUser);
    } else {
      res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı güncellenirken bir hata oluştu." });
  }
});

module.exports = router;
