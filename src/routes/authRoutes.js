const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { signupSchema, loginSchema, tokenSchema, requestPasswordResetSchema, resetPasswordSchema } = require("../validators/authValidator");
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: User registered
 *
 * /auth/confirm-email:
 *   get:
 *     summary: Confirm user email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email confirmed
 *
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Logged in successfully
 *
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New token issued
 *
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *
 * /auth/request-password-reset:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Reset email sent
 *
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset successful
 */


router.post('/signup', validate(signupSchema), authController.signup);
router.get('/confirm-email', authController.confirmEmail);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(tokenSchema), authController.refreshToken);
router.post('/request-password-reset', validate(requestPasswordResetSchema), authController.requestPasswordReset);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
