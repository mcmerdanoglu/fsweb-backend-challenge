const request = require("supertest");
const db = require("./data/dbConfig");
const server = require("./api/server");
const bcryptjs = require("bcryptjs");

afterAll(async () => {
  await db.destroy();
});
//beforeEach(async () => {
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

test("[0] Testler çalışır durumda]", () => {
  expect(true).toBe(true); //toBe(false)
});

describe("POST Auth", () => {
  test("[1] Auth/Register- Yeni kullanıcı veritabanına kaydoluyor mu?", async () => {
    //Arrange
    const userData = {
      username: "Heroku",
      password: "9999",
      email: "heroku@workintech.com",
    };
    //Act
    let actual = await request(server)
      .post("/api/auth/register")
      .send(userData);
    // Assert (Response check)
    expect(actual.status).toBe(201);
    expect(actual.body).toHaveProperty("username", "Heroku");
    expect(actual.body).toHaveProperty("email", "heroku@workintech.com");
  });

  test("[2] Auth/Register- Üye olurken doldurulmayan kısımlar için hata mesajı dönüyor mu?", async () => {
    const userData = {
      username: "İsrafil",
    };
    let actual = await request(server)
      .post("/api/auth/register")
      .send(userData);

    expect(actual.status).toBe(400);
  });

  test("[3] Auth/Register- Kullanıcı kayıt olunca şifresi hashlaniyor mu?", async () => {
    //Arrange
    let model = {
      username: "İsrafil",
      password: "8888",
      email: "israfil@workintech.com",
    };
    //Act
    let actual = await request(server).post("/api/auth/register").send(model);
    let isHashed = bcryptjs.compareSync(model.password, actual.body.password);
    //Assert
    expect(actual.status).toBe(201);
    expect(isHashed).toBeTruthy();
  });

  test("[4] Auth/Login- Kayıtlı kullanıcı hatalı bilgiler ile giriş yapınca hata veriyor mu?", async () => {
    //Arrange
    const userLoginData = {
      //user_id: "5",
      username: "cem",
      password: "6666",
      email: "cemoli@example.com",
    };
    //Act
    let actual = await request(server)
      .post("/api/auth/login")
      .send(userLoginData);
    // Assert
    expect(actual.status).toBe(400);
  });

  test("[5] Auth/Login- Kullanıcı girişi başarılı ise kullanıcıya erişilerek token bilgisi dönüyor mu?", async () => {
    //act
    var loginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };
    /// Act
    let actual = await request(server).post("/api/auth/login").send(loginModel);
    expect(actual.status).toBe(200);
    const response = await request(server)
      .get("/api/users/")
      .set("authorization", actual.body.token);
    // Assert
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(actual.body.token).toBeDefined();
  });
});

////////////////Endpointe göre Method Testleri/////////////////////

describe("USERS endpointi PUT ve DELETE method testleri", () => {
  /////USER UPDATE////
  test("[6]  Kayıtlı kullanıcı bilgileri güncellenebiliyor mu?", async () => {
    const loginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };

    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(loginModel);
    const token = loginResponse.body.token;

    const user = {
      username: "tekin",
      password: "989898",
      email: "tekin@workintech.com",
    };
    const response = await request(server)
      .post("/api/auth/register")
      .send(user);
    const userId = response.body.user_id;

    const updatingResult = await request(server)
      .put(`/api/users/${userId}`)
      .send({
        username: "tekinupdated",
        password: "99999999",
        email: "tekinupdated@workintech.com",
      })
      .set("authorization", token);

    expect(updatingResult.status).toBe(200);
  });

  /////USER DELETE////
  test("[7] Kayıtlı kullanıcı silinebiliyor mu?", async () => {
    const loginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };

    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(loginModel);
    const token = loginResponse.body.token;

    const user = {
      username: "ahmet",
      password: "6543",
      email: "ahmet@workintech.com",
    };

    const response = await request(server)
      .post("/api/auth/register")
      .send(user)
      .set("authorization", token);
    const userId = response.body.user_id;

    const deletionResult = await request(server)
      .delete(`/api/users/${userId}`)
      .set("authorization", token);

    expect(deletionResult.status).toBe(200);
  });
});

describe("POSTS endpointi POST, PUT ve DELETE method testleri", () => {
  /////SEND A POST////
  test("[8] Yeni bir gönderi oluşuyor mu?", async () => {
    const post = {
      post_content: "Hello Testing World",
    };

    const userLoginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };
    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(userLoginModel);
    const token = loginResponse.body.token;

    const postResult = await request(server)
      .post("/api/posts")
      .send(post)
      .set("authorization", token);

    expect(postResult.status).toBe(201);
  });
  /////UPDATE A POST////
  test("[9]  Kayıtlı gönderi güncellenebiliyor mu?", async () => {
    const loginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };

    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(loginModel);
    const token = loginResponse.body.token;

    const post = {
      post_content: "testing post update",
    };
    const response = await request(server)
      .post("/api/posts")
      .send(post)
      .set("authorization", token);
    const postId = response.body.user_id;

    const updatingResult = await request(server)
      .put(`/api/posts/${postId}`)
      .send({ post_content: "testing post update Updated" })
      .set("authorization", token);

    expect(updatingResult.status).toBe(200);
  });
  /////DELETE A POST////
  test("[10] Kayıtlı gönderi silinebiliyor mu?", async () => {
    const loginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };

    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(loginModel);
    const token = loginResponse.body.token;

    const post = {
      post_content: "testing ruleeesssss",
    };
    const response = await request(server)
      .post("/api/posts")
      .send(post)
      .set("authorization", token);
    const postId = response.body.post_id;

    const deletionResult = await request(server)
      .delete(`/api/posts/${postId}`)
      .set("authorization", token);

    expect(deletionResult.status).toBe(200);
  });
});

describe("COMMENTS endpointi POST, PUT ve DELETE method testleri", () => {
  /////SEND A COMMENT////
  test("[11] Yeni yorum gönderilebiliyor mu?", async () => {
    const comment = {
      post_id: "1",
      comment_content: "hello world testing challange",
    };

    const loginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };
    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(loginModel);
    const token = loginResponse.body.token;

    const commentResult = await request(server)
      .post("/api/comments")
      .send(comment)
      .set("authorization", token);

    expect(commentResult.status).toBe(201);
  });
  /////UPDATE A COMMENT////
  test("[12] Kayıtlı yorum güncellenebiliyor mu?", async () => {
    const loginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };

    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(loginModel);
    const token = loginResponse.body.token;

    const comment = {
      post_id: "1",
      comment_content: "testing comment update",
    };
    const response = await request(server)
      .post("/api/comments")
      .send(comment)
      .set("authorization", token);
    const commentId = response.body.user_id;

    const updatingResult = await request(server)
      .put(`/api/comments/${commentId}`)
      .send({ comment_content: "testing comment update Updated", post_id: "1" })
      .set("authorization", token);

    expect(updatingResult.status).toBe(200);
  });
  /////DELETE A COMMENT////
  test("[13] Kayıtlı yorum silinebiliyor mu?", async () => {
    const loginModel = {
      username: "cem",
      password: "1234",
      email: "cem@workintech.com",
    };

    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(loginModel);
    const token = loginResponse.body.token;

    const comment = {
      post_id: "1",
      comment_content: "delete this testing comment",
    };
    const response = await request(server)
      .post("/api/comments")
      .send(comment)
      .set("authorization", token);
    const commentId = response.body.user_id;

    const deletionResult = await request(server)
      .delete(`/api/comments/${commentId}`)
      .set("authorization", token);

    expect(deletionResult.status).toBe(200);
  });
});
