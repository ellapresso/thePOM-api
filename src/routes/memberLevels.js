const express = require("express");
const router = express.Router();
const memberLevelsController = require("../controllers/memberLevelsController");

/**
 * @swagger
 * /api/v1/member-levels:
 *   get:
 *     summary: 단원 레벨 목록 조회
 *     tags: [Member Levels]
 *     responses:
 *       200:
 *         description: 단원 레벨 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MemberLevel"
 */
router.get("/", memberLevelsController.getAll);

/**
 * @swagger
 * /api/v1/member-levels/{id}:
 *   get:
 *     summary: 단원 레벨 상세 조회
 *     tags: [Member Levels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 단원 레벨 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MemberLevel"
 *       404:
 *         description: 단원 레벨을 찾을 수 없음
 */
router.get("/:id", memberLevelsController.getById);

module.exports = router;

