const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

class AuthController {
  register = catchAsync(async (req, res) => {
    const { username, email, password, roles } = req.body;

    // Validate input
    if (!username || !email || !password) {
      throw new ApiError(400, 'Username, email and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new ApiError(400, 'Username already exists');
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(400, 'Email already exists');
    }

    // Create user with roles
    const user = await User.create(username, email, password);

    // Assign roles if provided
    if (Array.isArray(roles) && roles.length > 0) {
      for (const roleId of roles) {
        await User.assignRole(user.id, roleId);
      }
    }

    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });

  login = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, 'Username and password are required');
    }

    const user = await User.findByUsername(username);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passhash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Get user permissions
    const permissions = await User.getUserAllPermissions(user.id);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        permissions,
        token
      }
    });
  });

  getCurrentUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });

  getUserPermissions = catchAsync(async (req, res) => {
    const userPermissions = await User.getUserAllPermissions(req.user.id);
    res.json({
      status: 'success',
      data: userPermissions
    });
  });
}

module.exports = new AuthController(); 