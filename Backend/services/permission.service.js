const Permission = require('../models/Permission');
const ApiError = require('../utils/ApiError');

class PermissionService {
  async createPermission(name) {
    if (!name) {
      throw new ApiError(400, 'Permission name is required');
    }
    return Permission.create(name);
  }

  async getAllPermissions() {
    return Permission.findAll();
  }

  async getPermissionById(id) {
    const permission = await Permission.findById(id);
    if (!permission) {
      throw new ApiError(404, 'Permission not found');
    }
    return permission;
  }

  async updatePermission(id, name) {
    const permission = await this.getPermissionById(id);
    return Permission.update(id, name);
  }

  async deletePermission(id) {
    const permission = await this.getPermissionById(id);
    return Permission.delete(id);
  }
}

module.exports = new PermissionService(); 