const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: 관리자 로그인
 *     tags: [Admin]
 *     description: 관리자 로그인 (JWT 토큰 및 세션 생성, 동시 로그인 방지)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - password
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       401:
 *         description: 인증 실패
 */
router.post('/login', adminController.login);

/**
 * @swagger
 * /api/v1/admin/logout:
 *   post:
 *     summary: 관리자 로그아웃
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 */
router.post('/logout', adminController.logout);

// Protected routes
router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/admin/me:
 *   get:
 *     summary: 현재 로그인한 관리자 정보 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 관리자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: 인증 필요
 */
router.get('/me', adminController.getMe);

/**
 * @swagger
 * /api/v1/admin:
 *   get:
 *     summary: 관리자 목록 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 관리자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *   post:
 *     summary: 관리자 생성
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - password
 *               - name
 *               - adminType
 *             properties:
 *               loginId:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               adminType:
 *                 type: string
 *                 enum: [SYSTEM, NORMAL]
 *               memberId:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: 관리자 생성 성공
 *       409:
 *         description: 로그인 ID 중복
 */
router.get('/', adminController.getAll);
router.post('/', adminController.create);

/**
 * @swagger
 * /api/v1/admin/{id}:
 *   get:
 *     summary: 관리자 상세 조회
 *     tags: [Admin]
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
 *         description: 관리자 상세 조회 성공
 *       404:
 *         description: 관리자를 찾을 수 없음
 *   put:
 *     summary: 관리자 수정
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               adminType:
 *                 type: string
 *                 enum: [SYSTEM, NORMAL]
 *               memberId:
 *                 type: integer
 *                 nullable: true
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 관리자 수정 성공
 *   delete:
 *     summary: 관리자 삭제 (Soft Delete)
 *     tags: [Admin]
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
 *         description: 관리자 삭제 성공
 */
router.get('/:id', adminController.getById);
router.put('/:id', adminController.update);
router.delete('/:id', adminController.delete);

module.exports = router;

