const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createBookSchema, updateBookSchema } = require('../validators/bookValidator');


/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Manage book purchases
 */

/**
 * @swagger
 * /purchases:
 *   post:
 *     summary: Purchase all items in user's cart
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Purchase successful
 *
 *   get:
 *     summary: Get all purchases (admin only)
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all purchases
 *
 * /purchases/my:
 *   get:
 *     summary: Get current user's purchases
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's purchases
 */


router.post('/', authorize('user'), purchaseController.createPurchase);
router.get('/my', authorize('user'), purchaseController.getUserPurchases);
router.get('/', authorize(['subAdmin', 'rootAdmin']), purchaseController.getAllPurchases);


module.exports = router;
