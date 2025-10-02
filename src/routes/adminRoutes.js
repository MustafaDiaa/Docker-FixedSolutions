const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { updateSubAdminSchema, createSubAdminSchema } = require('../validators/adminValidator');

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: RootAdmin managing SubAdmins
 */

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get all SubAdmins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of SubAdmins
 *
 *   post:
 *     summary: Create a new SubAdmin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: SubAdmin created
 *
 * /admins/{id}:
 *   get:
 *     summary: Get SubAdmin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: SubAdmin details
 *
 *   put:
 *     summary: Update SubAdmin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Updated SubAdmin
 *
 *   delete:
 *     summary: Delete SubAdmin
 *     tags: [Admins]
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
 *         description: SubAdmin deleted
 */



// SubAdmin CRUD - restricted to rootAdmins only
router.get('/', authorize(['rootAdmin']), userController.getAllSubAdmins);
router.get('/:id', authorize(['rootAdmin']), userController.getSubAdminById);
router.post('/', authorize(['rootAdmin']), validate(createSubAdminSchema), userController.createSubAdmin);
router.put('/:id', authorize(['rootAdmin']), validate(updateSubAdminSchema), userController.updateSubAdmin);
router.delete('/:id', authorize(['rootAdmin']), userController.deleteSubAdmin);

module.exports = router;
