const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: 역할 목록 조회
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: 역할 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Role"
 */
router.get("/", rolesController.getAll);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: 역할 상세 조회
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 역할 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Role"
 *       404:
 *         description: 역할을 찾을 수 없음
 */
router.get("/:id", rolesController.getById);

module.exports = router;

