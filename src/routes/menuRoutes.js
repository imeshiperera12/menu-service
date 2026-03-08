const express = require("express");
const router = express.Router();
const controller = require("../controllers/menuController");

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu and Catalog management
 */

/**
 * @swagger
 * /menu/items:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - categoryId
 *               - name
 *               - price
 *             properties:
 *               restaurantId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item created successfully
 */
router.post("/items", controller.createMenuItem);

/**
 * @swagger
 * /menu/items:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of menu items
 */
router.get("/items", controller.getAllMenuItems);

/**
 * @swagger
 * /menu/items/{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Menu item not found
 */
router.get("/items/:id", controller.getMenuItemById);

/**
 * @swagger
 * /menu/items/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item updated
 */
router.put("/items/:id", controller.updateMenuItem);

/**
 * @swagger
 * /menu/items/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item deleted
 */
router.delete("/items/:id", controller.deleteMenuItem);

/**
 * @swagger
 * /menu/validate:
 *   post:
 *     summary: Validate requested items for an order
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItemId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Validation response
 */
router.post("/validate", controller.validateItemsForOrder);

/**
 * @swagger
 * /menu/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/categories", controller.getCategories);

/**
 * @swagger
 * /menu/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get("/restaurants", controller.getRestaurants);

module.exports = router;