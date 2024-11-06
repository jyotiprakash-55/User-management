const Role = require('../models/Role');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

class RoleController {
  createRole = catchAsync(async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
      throw new ApiError(400, 'Role name is required');
    }

    const existingRole = await Role.findByName(name);
    if (existingRole) {
      throw new ApiError(400, 'Role name already exists');
    }

    const role = await Role.create(name);
    res.status(201).json(role);
  });

  getAllRoles = catchAsync(async (req, res) => {
    const roles = await Role.findAll();
    res.json(roles || []);
  });

  getRoleById = catchAsync(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }
    res.json(role);
  });

  updateRole = catchAsync(async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      throw new ApiError(400, 'Role name is required');
    }

    const role = await Role.findById(id);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    const existingRole = await Role.findByName(name);
    if (existingRole && existingRole.id !== id) {
      throw new ApiError(400, 'Role name already exists');
    }

    await Role.update(id, name);
    res.json({ id, name });
  });

  deleteRole = catchAsync(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    await Role.delete(req.params.id);
    res.status(204).send();
  });

  assignPermission = catchAsync(async (req, res) => {
    const { id: roleId } = req.params;
    const { permissionId } = req.body;

    const role = await Role.findById(roleId);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    await Role.assignPermission(roleId, permissionId);
    res.json({
      status: 'success',
      data: { roleId, permissionId }
    });
  });

  removePermission = catchAsync(async (req, res) => {
    const { id: roleId, permissionId } = req.params;

    const role = await Role.findById(roleId);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    await Role.removePermission(roleId, permissionId);
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  getRolePermissions = catchAsync(async (req, res) => {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    const permissions = await Role.getPermissions(id);
    res.json({
      status: 'success',
      data: permissions
    });
  });
}

module.exports = new RoleController(); 