const express = require("express");
const router = express.Router();
const memberLevelsController = require("../controllers/memberLevelsController");
const auth = require("../middleware/auth");

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

/**
 * @swagger
 * /api/v1/member-levels:
 *   post:
 *     summary: 단원 레벨 등록
 *     tags: [Member Levels]
 *     security:
 *       - bearerAuth: []
 *     description: 관리자만 단원 레벨을 등록할 수 있습니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 단원 레벨 등록 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post("/", auth.verifyToken, memberLevelsController.create);

/**
 * @swagger
 * /api/v1/member-levels/{id}:
 *   put:
 *     summary: 단원 레벨 수정
 *     tags: [Member Levels]
 *     security:
 *       - bearerAuth: []
 *     description: 관리자만 단원 레벨을 수정할 수 있습니다.
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 단원 레벨 수정 성공
 *       404:
 *         description: 단원 레벨을 찾을 수 없음
 */
router.put("/:id", auth.verifyToken, memberLevelsController.update);

/**
 * @swagger
 * /api/v1/member-levels/{id}:
 *   delete:
 *     summary: 단원 레벨 삭제
 *     tags: [Member Levels]
 *     security:
 *       - bearerAuth: []
 *     description: 관리자만 단원 레벨을 삭제할 수 있습니다. 해당 레벨을 사용하는 멤버가 없을 경우에만 삭제 가능합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 단원 레벨 삭제 성공
 *       400:
 *         description: 해당 레벨을 사용하는 멤버가 있어 삭제할 수 없음
 *       404:
 *         description: 단원 레벨을 찾을 수 없음
 */
router.delete("/:id", auth.verifyToken, memberLevelsController.delete);

module.exports = router;

