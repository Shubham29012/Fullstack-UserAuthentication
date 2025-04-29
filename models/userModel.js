const db = require('../config/db');
const bcrypt = require('bcrypt');

const UserModel = {
  /**
   * Create a new user
   * @param {Object} userData - User data object
   * @returns {Promise} - PostgreSQL query result
   */
  async createUser(userData) {
    const { username, email, password } = userData;
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // SQL query to insert new user
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
    
    try {
      const result = await db.query(query, [username, email, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by username or email
   * @param {string} identifier - Username or email
   * @returns {Promise} - PostgreSQL query result
   */
  async findByUsernameOrEmail(identifier) {
    const query = `
      SELECT * FROM users
      WHERE username = $1 OR email = $1
    `;
    
    try {
      const result = await db.query(query, [identifier]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise} - PostgreSQL query result
   */
  async findById(id) {
    const query = `
      SELECT id, username, email, created_at FROM users
      WHERE id = $1
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if username exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} - Whether username exists
   */
  async usernameExists(username) {
    const query = `
      SELECT COUNT(*) FROM users
      WHERE username = $1
    `;
    
    try {
      const result = await db.query(query, [username]);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - Whether email exists
   */
  async emailExists(email) {
    const query = `
      SELECT COUNT(*) FROM users
      WHERE email = $1
    `;
    
    try {
      const result = await db.query(query, [email]);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserModel;