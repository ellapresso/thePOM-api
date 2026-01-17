const express = require("express");
const router = express.Router();
const performanceSessionsController = require("../controllers/performanceSessionsController");

/**
 * @swagger
 * /api/v1/performance-sessions:
 *   get:
 *     summary: 공연 회차 목록 조회
 *     tags: [Performance Sessions]
 *     parameters:
 *       - in: query
 *         name: performanceId
 *         schema:
 *           type: integer
 *         description: 공연 ID로 필터링
 *     responses:
 *       200:
 *         description: 공연 회차 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/PerformanceSession"
 */
router.get("/", performanceSessionsController.getAll);

/**
 * @swagger
 * /api/v1/performance-sessions/{id}:
 *   get:
 *     summary: 공연 회차 상세 조회
 *     tags: [Performance Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 공연 회차 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PerformanceSession"
 *       404:
 *         description: 공연 회차를 찾을 수 없음
 */
router.get("/:id", performanceSessionsController.getById);

module.exports = router;

