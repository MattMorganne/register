const db = require("../db");

const User = {
  // 1. Method to find all users
  findAll: async () => {
    const query = "SELECT id, username, email FROM users";
    const [rows] = await db.execute(query);
    return rows;
  },

  // 2. Method to find a single user by email
  findByEmail: async (email) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);
    return rows[0]; // Returns the user object, or undefined if not found
  },

  // 3. Method to create a new user
  create: async (userData) => {
    const { username, email, password } = userData;
    // NOTE: Always hash `password` before calling this method in real applications!
    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [username, email, password]);
    return result;
  }
};

module.exports = User;