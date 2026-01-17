const express = require('express');
const router = express.Router();
const rentalSchedulesController = require('../controllers/rentalSchedulesController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/rental-schedules:
 *   get:
 *     summary: 대관 스케줄 목록 조회
 *     tags: [Rental Schedules]
 *     parameters:
 *       - in: query
 *         name: renterType
 *         schema:
 *           type: string
 *           enum: [MEMBER, EXTERNAL]
 *         description: 대관자 타입으로 필터링
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 시작 날짜로 필터링
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 종료 날짜로 필터링
 *     responses:
 *       200:
 *         description: 대관 스케줄 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RentalSchedule'
 */
router.get('/', rentalSchedulesController.getAll);

/**
 * @swagger
 * /api/v1/rental-schedules/{id}:
 *   get:
 *     summary: 대관 스케줄 상세 조회
 *     tags: [Rental Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 대관 스케줄 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalSchedule'
 *       404:
 *         description: 대관 스케줄을 찾을 수 없음
 */
router.get('/:id', rentalSchedulesController.getById);

/**
 * @swagger
 * /api/v1/rental-schedules:
 *   post:
 *     summary: 대관 스케줄 등록
 *     tags: [Rental Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDatetime
 *               - endDatetime
 *               - renterType
 *               - renterName
 *             properties:
 *               startDatetime:
 *                 type: string
 *                 format: date-time
 *               endDatetime:
 *                 type: string
 *                 format: date-time
 *               renterType:
 *                 type: string
 *                 enum: [MEMBER, EXTERNAL]
 *               renterId:
 *                 type: integer
 *               renterName:
 *                 type: string
 *               purpose:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: 대관 스케줄 등록 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post('/', auth.verifyToken, rentalSchedulesController.create);

/**
 * @swagger
 * /api/v1/rental-schedules/{id}:
 *   put:
 *     summary: 대관 스케줄 수정
 *     tags: [Rental Schedules]
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
 *               startDatetime:
 *                 type: string
 *                 format: date-time
 *               endDatetime:
 *                 type: string
 *                 format: date-time
 *               renterType:
 *                 type: string
 *                 enum: [MEMBER, EXTERNAL]
 *               renterId:
 *                 type: integer
 *               renterName:
 *                 type: string
 *               purpose:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: 대관 스케줄 수정 성공
 *       404:
 *         description: 대관 스케줄을 찾을 수 없음
 */
router.put('/:id', auth.verifyToken, rentalSchedulesController.update);

/**
 * @swagger
 * /api/v1/rental-schedules/{id}:
 *   delete:
 *     summary: 대관 스케줄 삭제
 *     tags: [Rental Schedules]
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
 *         description: 대관 스케줄 삭제 성공
 *       404:
 *         description: 대관 스케줄을 찾을 수 없음
 */
router.delete('/:id', auth.verifyToken, rentalSchedulesController.delete);

module.exports = router;

