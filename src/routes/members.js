const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/members:
 *   get:
 *     summary: 단원 목록 조회
 *     tags: [Members]
 *     description: 비로그인 사용자도 검색 가능한 단원 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: profileVisible
 *         schema:
 *           type: boolean
 *         description: 프로필 공개 여부로 필터링
 *       - in: query
 *         name: memberLevelId
 *         schema:
 *           type: integer
 *         description: 단원 레벨 ID로 필터링
 *     responses:
 *       200:
 *         description: 단원 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 */
router.get('/', membersController.getAll);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   get:
 *     summary: 단원 상세 조회
 *     tags: [Members]
 *     description: 특정 단원의 상세 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 단원 ID
 *     responses:
 *       200:
 *         description: 단원 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       404:
 *         description: 단원을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', membersController.getById);

/**
 * @swagger
 * /api/v1/members:
 *   post:
 *     summary: 단원 등록
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     description: 관리자만 단원을 등록할 수 있습니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthDate
 *               - memberLevelId
 *               - firstJoinedAt
 *             properties:
 *               name:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *               phone:
 *                 type: string
 *               memberLevelId:
 *                 type: integer
 *               profileVisible:
 *                 type: boolean
 *               firstJoinedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: 단원 등록 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post('/', auth.verifyToken, membersController.create);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   put:
 *     summary: 단원 정보 수정
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     description: 관리자만 단원 정보를 수정할 수 있습니다.
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
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *               phone:
 *                 type: string
 *               memberLevelId:
 *                 type: integer
 *               profileVisible:
 *                 type: boolean
 *               firstJoinedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: 단원 정보 수정 성공
 *       404:
 *         description: 단원을 찾을 수 없음
 */
router.put('/:id', auth.verifyToken, membersController.update);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   delete:
 *     summary: 단원 삭제
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     description: 관리자만 단원을 삭제할 수 있습니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 단원 삭제 성공
 *       404:
 *         description: 단원을 찾을 수 없음
 */
router.delete('/:id', auth.verifyToken, membersController.delete);

module.exports = router;

