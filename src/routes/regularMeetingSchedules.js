const express = require('express');
const router = express.Router();
const regularMeetingSchedulesController = require('../controllers/regularMeetingSchedulesController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/regular-meeting-schedules:
 *   get:
 *     summary: 정기모임 스케줄 목록 조회
 *     tags: [Regular Meeting Schedules]
 *     parameters:
 *       - in: query
 *         name: meetingDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 모임 날짜로 필터링
 *     responses:
 *       200:
 *         description: 정기모임 스케줄 목록 조회 성공
 */
router.get('/', regularMeetingSchedulesController.getAll);

/**
 * @swagger
 * /api/v1/regular-meeting-schedules/{id}:
 *   get:
 *     summary: 정기모임 스케줄 상세 조회
 *     tags: [Regular Meeting Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 정기모임 스케줄 상세 조회 성공
 */
router.get('/:id', regularMeetingSchedulesController.getById);

// 관리자 전용
router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/regular-meeting-schedules:
 *   post:
 *     summary: 정기모임 스케줄 생성 (관리자 전용)
 *     tags: [Regular Meeting Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - meetingName
 *               - meetingDate
 *               - startTime
 *               - endTime
 *             properties:
 *               meetingName:
 *                 type: string
 *               meetingDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *     responses:
 *       201:
 *         description: 정기모임 스케줄 생성 성공
 */
router.post('/', regularMeetingSchedulesController.create);

/**
 * @swagger
 * /api/v1/regular-meeting-schedules/{id}:
 *   put:
 *     summary: 정기모임 스케줄 수정 (관리자 전용)
 *     tags: [Regular Meeting Schedules]
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
 *               meetingName:
 *                 type: string
 *               meetingDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *     responses:
 *       200:
 *         description: 정기모임 스케줄 수정 성공
 *   delete:
 *     summary: 정기모임 스케줄 삭제 (관리자 전용)
 *     tags: [Regular Meeting Schedules]
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
 *         description: 정기모임 스케줄 삭제 성공
 */
router.put('/:id', regularMeetingSchedulesController.update);
router.delete('/:id', regularMeetingSchedulesController.delete);

module.exports = router;

