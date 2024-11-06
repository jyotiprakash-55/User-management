const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete('/:id', userController.deleteUser);

// Role management routes
/**
 * @swagger
 * /api/users/{id}/roles:
 *   get:
 *     summary: Get user's roles
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's roles
 */
router.get('/:id/roles', userController.getUserRoles);

/**
 * @swagger
 * /api/users/{id}/roles:
 *   post:
 *     summary: Assign a role to user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role assigned successfully
 */
router.post('/:id/roles', userController.assignRole);

/**
 * @swagger
 * /api/users/{id}/roles/{roleId}:
 *   delete:
 *     summary: Remove a role from user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Role removed successfully
 */
router.delete('/:id/roles/:roleId', userController.removeRole);

/**
 * @swagger
 * /api/users/{id}/roles/batch:
 *   post:
 *     summary: Assign multiple roles to user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Roles assigned successfully
 */
router.post('/:id/roles/batch', userController.assignMultipleRoles);

// Permission management routes
router.post('/:id/permissions', userController.assignPermission);
router.get('/:id/permissions', userController.getUserPermissions);
router.delete('/:id/permissions/:permissionId', userController.removePermission);

/**
 * @swagger
 * /api/users/{id}/all-permissions:
 *   get:
 *     summary: Get all user permissions (direct + from roles)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all user permissions
 */
router.get('/:id/all-permissions', userController.getAllUserPermissions);

/**
 * @swagger
 * /api/users/{id}/permissions/batch:
 *   post:
 *     summary: Assign multiple permissions to user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 */
router.post('/:id/permissions/batch', userController.assignMultiplePermissions);

/**
 * @swagger
 * /api/users/{id}/permissions/batch:
 *   delete:
 *     summary: Remove multiple permissions from user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       204:
 *         description: Permissions removed successfully
 */
router.delete('/:id/permissions/batch', userController.removeMultiplePermissions);

module.exports = router; 