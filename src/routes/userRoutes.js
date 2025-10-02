const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { updateProfileSchema, changePasswordSchema, createUserSchema, updateUserSchema } = require('../validators/userValidator');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and CRUD management
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 *
 *   delete:
 *     summary: Delete current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *
 * /users/me/password:
 *   patch:
 *     summary: Change current user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed
 *
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User created
 *
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *
 *   put:
 *     summary: Update user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated
 *
 *   delete:
 *     summary: Delete user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */


// Current user profile management - accessible by all authenticated users
router.get('/me', authorize(['user', 'subAdmin', 'rootAdmin']), userController.getCurrentUser);
router.put('/me', authorize(['user', 'subAdmin', 'rootAdmin']), validate(updateProfileSchema), userController.updateCurrentUser);
router.delete('/me', authorize(['user', 'subAdmin', 'rootAdmin']), userController.deleteCurrentUser);
router.patch('/me/password', authorize(['user', 'subAdmin', 'rootAdmin']), validate(changePasswordSchema), userController.changePassword);

// User CRUD - accessible by rootAdmins and subAdmins
router.get('/', authorize(['rootAdmin', 'subAdmin']), userController.getAllUsers);
router.get('/:id', authorize(['rootAdmin', 'subAdmin']), userController.getUserById);
router.post('/', authorize(['rootAdmin', 'subAdmin']), validate(createUserSchema), userController.createUser);
router.put('/:id', authorize(['rootAdmin', 'subAdmin']), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authorize(['rootAdmin', 'subAdmin']), userController.deleteUser);



module.exports = router;
