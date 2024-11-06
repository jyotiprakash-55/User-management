const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Permission {
  static async create(name) {
    const id = uuidv4();
    const [result] = await db.query(
      'INSERT INTO permissions (id, permission_name) VALUES (?, ?)',
      [id, name]
    );
    return { id, ...result };
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM permissions WHERE is_deleted = FALSE');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM permissions WHERE id = ? AND is_deleted = FALSE',
      [id]
    );
    return rows[0];
  }

  static async update(id, name) {
    const [result] = await db.query(
      'UPDATE permissions SET permission_name = ? WHERE id = ? AND is_deleted = FALSE',
      [name, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.query(
      'UPDATE permissions SET is_deleted = TRUE, deletion_time = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return result;
  }

  static async findByName(name, includeDeleted = false) {
    const query = includeDeleted 
      ? 'SELECT * FROM permissions WHERE permission_name = ?'
      : 'SELECT * FROM permissions WHERE permission_name = ? AND is_deleted = FALSE';
    
    const [rows] = await db.query(query, [name]);
    return rows[0];
  }

  static async getRolePermissions(roleId) {
    const [rows] = await db.query(
      `SELECT p.* FROM permissions p 
       INNER JOIN role_permissions rp ON p.id = rp.permission_id 
       WHERE rp.role_id = ? AND rp.is_deleted = FALSE AND p.is_deleted = FALSE`,
      [roleId]
    );
    return rows;
  }

  static async getUserPermissions(userId) {
    const [rows] = await db.query(
      `SELECT DISTINCT p.* FROM permissions p 
       LEFT JOIN user_permissions up ON p.id = up.permission_id 
       LEFT JOIN role_permissions rp ON p.id = rp.permission_id 
       LEFT JOIN user_roles ur ON rp.role_id = ur.role_id 
       WHERE (up.user_id = ? OR ur.user_id = ?) 
       AND p.is_deleted = FALSE 
       AND (up.is_deleted = FALSE OR rp.is_deleted = FALSE)
       AND (ur.is_deleted = FALSE OR ur.is_deleted IS NULL)`,
      [userId, userId]
    );
    return rows;
  }
}

module.exports = Permission; 