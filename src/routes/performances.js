const express = require('express');
const router = express.Router();
const performancesController = require('../controllers/performancesController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/performances:
 *   get:
 *     summary: 공연 목록 조회
 *     tags: [Performances]
 *     responses:
 *       200:
 *         description: 공연 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Performance'
 */
router.get('/', performancesController.getAll);

/**
 * @swagger
 * /api/v1/performances/{id}:
 *   get:
 *     summary: 공연 상세 조회
 *     tags: [Performances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 공연 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Performance'
 *       404:
 *         description: 공연을 찾을 수 없음
 */
router.get('/:id', performancesController.getById);

/**
 * @swagger
 * /api/v1/performances:
 *   post:
 *     summary: 공연 등록
 *     tags: [Performances]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: 공연 등록 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post('/', auth.verifyToken, performancesController.create);

/**
 * @swagger
 * /api/v1/performances/{id}:
 *   put:
 *     summary: 공연 정보 수정
 *     tags: [Performances]
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
 *               title:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: 공연 정보 수정 성공
 *       404:
 *         description: 공연을 찾을 수 없음
 */
router.put('/:id', auth.verifyToken, performancesController.update);

/**
 * @swagger
 * /api/v1/performances/{id}:
 *   delete:
 *     summary: 공연 삭제
 *     tags: [Performances]
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
 *         description: 공연 삭제 성공
 *       404:
 *         description: 공연을 찾을 수 없음
 */
router.delete('/:id', auth.verifyToken, performancesController.delete);

module.exports = router;

