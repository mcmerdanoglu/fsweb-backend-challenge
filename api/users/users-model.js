const db = require("../../data/dbConfig");

async function getAllUsers() {
  return await db("users");
}

// const getByUserFilter = async (filter) => {
//   const user = await db("users").where(filter).first();
//   return user;
// };

const getUserByUsername = async (username) => {
  return await db("users").where("username", username).first();
};

async function getUserById(userId) {
  return await db("users").where({ user_id: userId }).first();
}

async function addUser(insertedUserModel) {
  await db("users").insert(insertedUserModel);
  return getUserByUsername(insertedUserModel.username);
}

async function updateUser(userId, updatedUser) {
  return await db("users").where({ user_id: userId }).update(updatedUser);
}

async function deleteUser(userId) {
  return await db("users").where({ user_id: userId }).del();
}

module.exports = {
  getAllUsers,
  //getByUserFilter,
  getUserByUsername,
  getUserById,
  addUser,
  deleteUser,
  updateUser,
};
