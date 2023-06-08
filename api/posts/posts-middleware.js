const checkPost = (req, res, next) => {
  const { post_content } = req.body;
  if (
    !post_content ||
    typeof post_content !== "string" ||
    !post_content.trim()
  ) {
    res.status(400).json({
      message: "Gönderiniz boş olmamalı ve metin olarak girilmelidir.",
    });
  } else if (post_content.length > 250) {
    res
      .status(400)
      .json({ message: "Gönderiniz 250 karakterden fazla olamaz." });
  } else {
    next();
  }
};

module.exports = {
  checkPost,
};
