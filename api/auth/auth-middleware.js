const userModel = require("../users/users-model");
const bcryptjs = require("bcryptjs");

const checkUserPayload = (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    if (!username || !password || !email) {
      res
        .status(400)
        .json({ messsage: "Eksik alanları kontrol ederek tekrar deneyiniz" });
    }
    if (
      username.trim().length < 3 ||
      password.trim().length < 3 ||
      email.split("@")[0].trim().length < 3
    ) {
      res.status(400).json({
        message:
          "Kullanıcı adı, şifre ve email adresinizin ön kısmı en az 3 karakter olmalıdır",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

async function checkUser(req, res, next) {
  try {
    let isExistingUser = await userModel.getUserByUsername(req.body.username);
    if (!isExistingUser) {
      res.status(404).json({ message: "geçersiz kriterler" });
    } else {
      let isPasswordMatch = bcryptjs.compareSync(
        req.body.password,
        isExistingUser.password
      );
      if (isPasswordMatch) {
        req.currentUser = isExistingUser;
        next();
      } else {
        res
          .status(400)
          .json({ message: "Lütfen girilen bilgileri kontrol ediniz" });
      }
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkUserPayload,
  checkUser,
};
