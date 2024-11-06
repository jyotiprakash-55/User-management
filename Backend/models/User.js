const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(username, email, password) {
    const id = uuidv4();
    const passhash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (id, username, email, passhash) VALUES (?, ?, ?, ?)',
      [id, username, email, passhash]
    );
    return { id, ...result };
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM users WHERE is_deleted = FALSE');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ? AND is_deleted = FALSE',
      [id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_deleted = FALSE',
      [email]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? AND is_deleted = FALSE',
      [username]
    );
    return rows[0];
  }

  static async assignRole(userId, roleId) {
    const [result] = await db.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?) ' +
      'ON DUPLICATE KEY UPDATE is_deleted = FALSE, deletion_time = NULL',
      [userId, roleId]
    );
    return result;
  }

  static async assignPermission(userId, permissionId) {
    const [result] = await db.query(
      'INSERT INTO user_permissions (user_id, permission_id) VALUES (?, ?) ' +
      'ON DUPLICATE KEY UPDATE is_deleted = FALSE, deletion_time = NULL',
      [userId, permissionId]
    );
    return result;
  }

  static async getUserRoles(userId) {
    const [rows] = await db.query(
      `SELECT r.* FROM roles r 
       INNER JOIN user_roles ur ON r.id = ur.role_id 
       WHERE ur.user_id = ? AND ur.is_deleted = FALSE AND r.is_deleted = FALSE
       ORDER BY r.role_name`,
      [userId]
    );
    return rows;
  }

  static async getUserPermissions(userId) {
    const [rows] = await db.query(
      `SELECT p.* FROM permissions p 
       INNER JOIN user_permissions up ON p.id = up.permission_id 
       WHERE up.user_id = ? AND up.is_deleted = FALSE AND p.is_deleted = FALSE`,
      [userId]
    );
    return rows;
  }

  static async getUserAllPermissions(userId) {
    const [rows] = await db.query(
      `SELECT DISTINCT p.* 
       FROM permissions p 
       LEFT JOIN user_permissions up ON p.id = up.permission_id 
       LEFT JOIN role_permissions rp ON p.id = rp.permission_id 
       LEFT JOIN user_roles ur ON rp.role_id = ur.role_id 
       WHERE up.user_id = ? OR ur.user_id = ?`,
      [userId, userId]
    );
    return rows;
  }

  static async update(id, username, email) {
    const [result] = await db.query(
      'UPDATE users SET username = ?, email = ? WHERE id = ? AND is_deleted = FALSE',
      [username, email, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.query(
      'UPDATE users SET is_deleted = TRUE, deletion_time = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return result;
  }

  static async removeRole(userId, roleId) {
    const [result] = await db.query(
      'UPDATE user_roles SET is_deleted = TRUE, deletion_time = CURRENT_TIMESTAMP ' +
      'WHERE user_id = ? AND role_id = ?',
      [userId, roleId]
    );
    return result;
  }

  static async removePermission(userId, permissionId) {
    const [result] = await db.query(
      'UPDATE user_permissions SET is_deleted = TRUE, deletion_time = CURRENT_TIMESTAMP ' +
      'WHERE user_id = ? AND permission_id = ?',
      [userId, permissionId]
    );
    return result;
  }

  static async assignRoles(userId, roleIds) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // First, mark all existing roles as deleted
      await connection.query(
        'UPDATE user_roles SET is_deleted = TRUE, deletion_time = CURRENT_TIMESTAMP WHERE user_id = ?',
        [userId]
      );

      // Then, insert or reactivate the selected roles
      if (roleIds.length > 0) {
        const values = roleIds.map(roleId => [userId, roleId]);
        await connection.query(
          `INSERT INTO user_roles (user_id, role_id) 
           VALUES ? 
           ON DUPLICATE KEY UPDATE is_deleted = FALSE, deletion_time = NULL`,
          [values]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = User; 