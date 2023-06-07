/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("comments").truncate();
  await knex("posts").truncate();
  await knex("users").truncate();

  await knex("users").insert([
    {
      user_id: 1,
      username: "cem",
      password: "1111",
      email: "cem@workintech.com",
    },
    {
      user_id: 2,
      username: "ali",
      password: "2222",
      email: "ali@workintech.com",
    },
    {
      user_id: 3,
      username: "veli",
      password: "3333",
      email: "veli@workintech.com",
    },
  ]);

  await knex("posts").insert([
    {
      post_id: 1,
      user_id: 1,
      post_content: "Öncelikle selamlar arkadaşlar",
      post_time: new Date(),
    },
    {
      post_id: 2,
      user_id: 2,
      post_content: "Yeeeaa macarenaaa!!!",
      post_time: new Date(),
    },
    {
      post_id: 3,
      user_id: 3,
      post_content: "İçanadolu bölgesinde kene krizi büyüyor",
      post_time: new Date(),
    },
    {
      post_id: 4,
      user_id: 1,
      post_content: "Ofiste bir günüm nasıl geçiyor adlı vloguma hoşgeldiniz",
      post_time: new Date(),
    },
  ]);

  await knex("comments").insert([
    {
      comment_id: 1,
      user_id: 2,
      post_id: 1,
      comment_content: "Size de merhabalar",
      comment_time: new Date(),
    },
    {
      comment_id: 2,
      user_id: 3,
      post_id: 4,
      comment_content: "İzleyelim bakalım, umarım ilginçtir",
      comment_time: new Date(),
    },
    {
      comment_id: 3,
      user_id: 1,
      post_id: 2,
      comment_content: "Hola como esta? Tudo bien...",
      comment_time: new Date(),
    },
  ]);
};
