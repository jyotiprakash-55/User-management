const Role = require('../models/Role');
const ApiError = require('../utils/ApiError');

class RoleService {
  async createRole(name) {
    if (!name) {
      throw new ApiError(400, 'Role name is required');
    }
    return Role.create(name);
  }

  async getAllRoles() {
    return Role.findAll();
  }

  async getRoleById(id) {
    const role = await Role.findById(id);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }
    return role;
  }

  async updateRole(id, name) {
    const role = await this.getRoleById(id);
    return Role.update(id, name);
  }

  async deleteRole(id) {
    const role = await this.getRoleById(id);
    return Role.delete(id);
  }

  async assignPermission(roleId, permissionId) {
    const role = await this.getRoleById(roleId);
    return Role.assignPermission(roleId, permissionId);
  }

  async getRolePermissions(roleId) {
    const role = await this.getRoleById(roleId);
    return Role.getPermissions(roleId);
  }

  async removePermission(roleId, permissionId) {
    const role = await this.getRoleById(roleId);
    return Role.removePermission(roleId, permissionId);
  }
}

module.exports = new RoleService(); 