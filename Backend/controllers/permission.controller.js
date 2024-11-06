const Permission = require('../models/Permission');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

class PermissionController {
  createPermission = catchAsync(async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
      throw new ApiError(400, 'Permission name is required');
    }

    const existingPermission = await Permission.findByName(name, false);
    if (existingPermission) {
      throw new ApiError(400, 'Permission name already exists');
    }

    const permission = await Permission.create(name);
    res.status(201).json({
      status: 'success',
      data: permission
    });
  });

  getAllPermissions = catchAsync(async (req, res) => {
    const permissions = await Permission.findAll();
    res.json(permissions || []);
  });

  getPermissionById = catchAsync(async (req, res) => {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      throw new ApiError(404, 'Permission not found');
    }
    res.json({
      status: 'success',
      data: permission
    });
  });

  updatePermission = catchAsync(async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      throw new ApiError(400, 'Permission name is required');
    }

    const permission = await Permission.findById(id);
    if (!permission) {
      throw new ApiError(404, 'Permission not found');
    }

    const existingPermission = await Permission.findByName(name, false);
    if (existingPermission && existingPermission.id !== id) {
      throw new ApiError(400, 'Permission name already exists');
    }

    await Permission.update(id, name);
    
    const updatedPermission = await Permission.findById(id);
    res.json(updatedPermission);
  });

  deletePermission = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const permission = await Permission.findById(id);
    if (!permission) {
      throw new ApiError(404, 'Permission not found');
    }

    await Permission.delete(id);
    res.status(204).send();
  });
}

module.exports = new PermissionController(); 