const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { addToCartSchema, updateCartItemSchema } = require('../validators/cartValidator');


/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Manage user cart
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart
 *
 *   post:
 *     summary: Add book to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book added to cart
 *
 *   put:
 *     summary: Update book quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart updated
 *
 * /cart/{bookId}:
 *   delete:
 *     summary: Remove book from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed
 */


router.get('/', authorize(['user']), cartController.getCart);
router.post('/', authorize(['user']), validate(addToCartSchema), cartController.addToCart);
router.put('/', authorize(['user']), validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/:bookId', authorize(['user']), cartController.removeFromCart);

module.exports = router;
