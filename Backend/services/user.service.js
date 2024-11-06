const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(username, email, password) {
    if (!username || !email || !password) {
      throw new ApiError(400, 'Username, email and password are required');
    }
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'Email already exists');
    }

    return User.create(username, email, password);
  }

  async getAllUsers() {
    return User.findAll();
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async assignRole(userId, roleId) {
    const user = await this.getUserById(userId);
    return User.assignRole(userId, roleId);
  }

  async assignPermission(userId, permissionId) {
    const user = await this.getUserById(userId);
    return User.assignPermission(userId, permissionId);
  }

  async getUserRoles(userId) {
    const user = await this.getUserById(userId);
    return User.getUserRoles(userId);
  }

  async getUserPermissions(userId) {
    const user = await this.getUserById(userId);
    return User.getUserPermissions(userId);
  }

  async getUserAllPermissions(userId) {
    const user = await this.getUserById(userId);
    return User.getUserAllPermissions(userId);
  }

  async updateUser(id, username, email) {
    const user = await this.getUserById(id);
    if (!username && !email) {
      throw new ApiError(400, 'At least one field (username or email) is required');
    }
    return User.update(id, username, email);
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    return User.delete(id);
  }

  async removeRole(userId, roleId) {
    const user = await this.getUserById(userId);
    return User.removeRole(userId, roleId);
  }

  async removePermission(userId, permissionId) {
    const user = await this.getUserById(userId);
    return User.removePermission(userId, permissionId);
  }
}

module.exports = new UserService(); 