const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Role {
  static async create(name) {
    const id = uuidv4();
    const [result] = await db.query(
      'INSERT INTO roles (id, role_name) VALUES (?, ?)',
      [id, name]
    );
    return { id, role_name: name };
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM roles WHERE is_deleted = FALSE');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM roles WHERE id = ? AND is_deleted = FALSE',
      [id]
    );
    return rows[0];
  }

  static async update(id, name) {
    const [result] = await db.query(
      'UPDATE roles SET role_name = ? WHERE id = ? AND is_deleted = FALSE',
      [name, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.query(
      'UPDATE roles SET is_deleted = TRUE, deletion_time = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return result;
  }

  static async findByName(name) {
    const [rows] = await db.query(
      'SELECT * FROM roles WHERE role_name = ? AND is_deleted = FALSE',
      [name]
    );
    return rows[0];
  }

  static async getPermissions(roleId) {
    const [rows] = await db.query(
      `SELECT p.* FROM permissions p 
       INNER JOIN role_permissions rp ON p.id = rp.permission_id 
       WHERE rp.role_id = ? AND rp.is_deleted = FALSE AND p.is_deleted = FALSE`,
      [roleId]
    );
    return rows;
  }

  static async assignPermission(roleId, permissionId) {
    const [result] = await db.query(
      `INSERT INTO role_permissions (role_id, permission_id) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE is_deleted = FALSE, deletion_time = NULL`,
      [roleId, permissionId]
    );
    return result;
  }

  static async removePermission(roleId, permissionId) {
    const [result] = await db.query(
      `UPDATE role_permissions 
       SET is_deleted = TRUE, deletion_time = CURRENT_TIMESTAMP 
       WHERE role_id = ? AND permission_id = ?`,
      [roleId, permissionId]
    );
    return result;
  }
}

module.exports = Role; 