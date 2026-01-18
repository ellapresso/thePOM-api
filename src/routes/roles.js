const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");
const { verifyToken, requireAdmin, requireSystemAdmin } = require("../middleware/auth");

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

// 시스템 관리자만 접근 가능한 CRUD 엔드포인트
/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: 역할 생성 (시스템 관리자만)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 역할 생성 성공
 *       403:
 *         description: 시스템 관리자 권한 필요
 */
router.post("/", verifyToken, requireAdmin, requireSystemAdmin, rolesController.create);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: 역할 수정 (시스템 관리자만)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 역할 수정 성공
 *       403:
 *         description: 시스템 관리자 권한 필요
 *       404:
 *         description: 역할을 찾을 수 없음
 */
router.put("/:id", verifyToken, requireAdmin, requireSystemAdmin, rolesController.update);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: 역할 삭제 (시스템 관리자만)
 *     tags: [Roles]
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
 *         description: 역할 삭제 성공
 *       403:
 *         description: 시스템 관리자 권한 필요
 *       404:
 *         description: 역할을 찾을 수 없음
 */
router.delete("/:id", verifyToken, requireAdmin, requireSystemAdmin, rolesController.delete);

module.exports = router;

