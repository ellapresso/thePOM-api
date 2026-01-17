const express = require("express");
const router = express.Router();
const adminLoginLogsController = require("../controllers/adminLoginLogsController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/admin-login-logs:
 *   get:
 *     summary: 관리자 로그인 로그 목록 조회 (관리자 전용)
 *     tags: [Admin Login Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: adminId
 *         schema:
 *           type: integer
 *         description: 관리자 ID로 필터링
 *       - in: query
 *         name: success
 *         schema:
 *           type: boolean
 *         description: 로그인 성공 여부로 필터링
 *     responses:
 *       200:
 *         description: 관리자 로그인 로그 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   adminId:
 *                     type: integer
 *                   loginAt:
 *                     type: string
 *                     format: date-time
 *                   ipAddress:
 *                     type: string
 *                   userAgent:
 *                     type: string
 *                   success:
 *                     type: boolean
 */
router.get("/", adminLoginLogsController.getAll);

/**
 * @swagger
 * /api/v1/admin-login-logs/{id}:
 *   get:
 *     summary: 관리자 로그인 로그 상세 조회 (관리자 전용)
 *     tags: [Admin Login Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 관리자 로그인 로그 상세 조회 성공
 *       404:
 *         description: 로그인 로그를 찾을 수 없음
 */
router.get("/:id", adminLoginLogsController.getById);

module.exports = router;

