const router = require("express").Router();
const { checkUserPayload, checkUser } = require("./auth-middleware");
const { JWT_SECRET } = require("../secrets/secret");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const userModel = require("../users/users-model");

router.post("/register", checkUserPayload, async (req, res, next) => {
  try {
    let hashedPassword = bcryptjs.hashSync(req.body.password);
    let userRequestModel = {
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    };
    const registeredUser = await userModel.addUser(userRequestModel);
    res.status(201).json(registeredUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", checkUserPayload, checkUser, (req, res, next) => {
  try {
    let payload = {
      id: req.currentUser.id,
      username: req.currentUser.username,
      email: req.currentUser.email,
      // Bu bölümde kesinlikle password gönderilmeyecek!!!
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    res.json({
      message: `Hoşgeldin ${req.currentUser.username}. Seni burada görmek çok güzel!`,
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
