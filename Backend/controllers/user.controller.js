const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

class UserController {
  createUser = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, 'Username, email and password are required');
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      throw new ApiError(400, 'Username already exists');
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(400, 'Email already exists');
    }

    const user = await User.create(username, email, password);
    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });

  getAllUsers = catchAsync(async (req, res) => {
    const users = await User.findAll();
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    }));
    
    res.json({
      status: 'success',
      data: sanitizedUsers
    });
  });

  getUserById = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { passhash, ...sanitizedUser } = user;
    res.json({
      status: 'success',
      data: sanitizedUser
    });
  });

  updateUser = catchAsync(async (req, res) => {
    const { username, email } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (username) {
      const existingUsername = await User.findByUsername(username);
      if (existingUsername && existingUsername.id !== id) {
        throw new ApiError(400, 'Username already exists');
      }
    }

    if (email) {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail && existingEmail.id !== id) {
        throw new ApiError(400, 'Email already exists');
      }
    }

    await User.update(id, username, email);
    
    // Get the updated user to include all fields
    const updatedUser = await User.findById(id);
    const { passhash, ...sanitizedUser } = updatedUser;
    
    res.json({
      status: 'success',
      data: sanitizedUser  // This will include created_at
    });
  });

  deleteUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await User.delete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  assignRole = catchAsync(async (req, res) => {
    const { id: userId } = req.params;
    const { roleId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await User.assignRole(userId, roleId);
    res.json({
      status: 'success',
      data: { userId, roleId }
    });
  });

  removeRole = catchAsync(async (req, res) => {
    const { id: userId, roleId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await User.removeRole(userId, roleId);
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  getUserRoles = catchAsync(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const roles = await User.getUserRoles(id);
    res.json({
      status: 'success',
      data: roles
    });
  });

  getUserPermissions = catchAsync(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const permissions = await User.getUserPermissions(id);
    res.json({
      status: 'success',
      data: permissions
    });
  });

  assignPermission = catchAsync(async (req, res) => {
    const { id: userId } = req.params;
    const { permissionId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await User.assignPermission(userId, permissionId);
    res.json({
      status: 'success',
      data: { userId, permissionId }
    });
  });

  removePermission = catchAsync(async (req, res) => {
    const { id: userId, permissionId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await User.removePermission(userId, permissionId);
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  getAllUserPermissions = catchAsync(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const permissions = await User.getUserAllPermissions(id);
    res.json({
      status: 'success',
      data: permissions
    });
  });

  assignMultiplePermissions = catchAsync(async (req, res) => {
    const { id: userId } = req.params;
    const { permissionIds } = req.body;

    if (!Array.isArray(permissionIds)) {
      throw new ApiError(400, 'permissionIds must be an array');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Assign all permissions
    for (const permissionId of permissionIds) {
      await User.assignPermission(userId, permissionId);
    }

    res.json({
      status: 'success',
      data: { userId, permissionIds }
    });
  });

  removeMultiplePermissions = catchAsync(async (req, res) => {
    const { id: userId } = req.params;
    const { permissionIds } = req.body;

    if (!Array.isArray(permissionIds)) {
      throw new ApiError(400, 'permissionIds must be an array');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Remove all permissions
    for (const permissionId of permissionIds) {
      await User.removePermission(userId, permissionId);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  assignMultipleRoles = catchAsync(async (req, res) => {
    const { id: userId } = req.params;
    const { roleIds } = req.body;

    if (!Array.isArray(roleIds)) {
      throw new ApiError(400, 'roleIds must be an array');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await User.assignRoles(userId, roleIds);

    res.json({
      status: 'success',
      data: { userId, roleIds }
    });
  });
}

module.exports = new UserController(); 