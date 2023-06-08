const checkComment = (req, res, next) => {
  const { comment_content, post_id } = req.body;

  if (
    !post_id ||
    !comment_content ||
    typeof comment_content !== "string" ||
    !comment_content.trim()
  ) {
    res.status(400).json({
      message:
        "Yorum yapılacak gönderi Idsi ile yorum içeriği boş olmamalı ve yorum metin olarak girilmelidir.",
    });
  } else if (comment_content.length > 250) {
    res
      .status(400)
      .json({ message: "Yorumunuz 250 karakterden fazla olamaz." });
  } else {
    next();
  }
};

module.exports = {
  checkComment,
};
