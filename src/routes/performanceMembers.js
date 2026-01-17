const express = require("express");
const router = express.Router();
const performanceMembersController = require("../controllers/performanceMembersController");

/**
 * @swagger
 * /api/v1/performance-members:
 *   get:
 *     summary: 공연 참여 목록 조회
 *     tags: [Performance Members]
 *     parameters:
 *       - in: query
 *         name: performanceSessionId
 *         schema:
 *           type: integer
 *         description: 공연 회차 ID로 필터링
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: integer
 *         description: 단원 ID로 필터링
 *     responses:
 *       200:
 *         description: 공연 참여 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/PerformanceMember"
 */
router.get("/", performanceMembersController.getAll);

/**
 * @swagger
 * /api/v1/performance-members/{id}:
 *   get:
 *     summary: 공연 참여 상세 조회
 *     tags: [Performance Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 공연 참여 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PerformanceMember"
 *       404:
 *         description: 공연 참여 정보를 찾을 수 없음
 */
router.get("/:id", performanceMembersController.getById);

module.exports = router;

