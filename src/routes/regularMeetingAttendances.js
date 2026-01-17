const express = require('express');
const router = express.Router();
const regularMeetingAttendancesController = require('../controllers/regularMeetingAttendancesController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/regular-meeting-attendances:
 *   get:
 *     summary: 정기모임 참석 로그 목록 조회
 *     tags: [Regular Meeting Attendances]
 *     parameters:
 *       - in: query
 *         name: regularMeetingScheduleId
 *         schema:
 *           type: integer
 *         description: 정기모임 스케줄 ID로 필터링
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: integer
 *         description: 단원 ID로 필터링
 *     responses:
 *       200:
 *         description: 정기모임 참석 로그 목록 조회 성공
 */
router.get('/', regularMeetingAttendancesController.getAll);

/**
 * @swagger
 * /api/v1/regular-meeting-attendances/{id}:
 *   get:
 *     summary: 정기모임 참석 로그 상세 조회
 *     tags: [Regular Meeting Attendances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 정기모임 참석 로그 상세 조회 성공
 */
router.get('/:id', regularMeetingAttendancesController.getById);

// 관리자 전용
router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/regular-meeting-attendances:
 *   post:
 *     summary: 정기모임 참석 로그 생성 (관리자 전용)
 *     tags: [Regular Meeting Attendances]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - regularMeetingScheduleId
 *               - memberId
 *               - attendanceStatus
 *             properties:
 *               regularMeetingScheduleId:
 *                 type: integer
 *               memberId:
 *                 type: integer
 *               attendanceStatus:
 *                 type: string
 *                 enum: [attended, absent, late]
 *               memo:
 *                 type: string
 *     responses:
 *       201:
 *         description: 정기모임 참석 로그 생성 성공
 */
router.post('/', regularMeetingAttendancesController.create);

/**
 * @swagger
 * /api/v1/regular-meeting-attendances/{id}:
 *   put:
 *     summary: 정기모임 참석 로그 수정 (관리자 전용)
 *     tags: [Regular Meeting Attendances]
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
 *               attendanceStatus:
 *                 type: string
 *                 enum: [attended, absent, late]
 *               memo:
 *                 type: string
 *     responses:
 *       200:
 *         description: 정기모임 참석 로그 수정 성공
 *   delete:
 *     summary: 정기모임 참석 로그 삭제 (관리자 전용)
 *     tags: [Regular Meeting Attendances]
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
 *         description: 정기모임 참석 로그 삭제 성공
 */
router.put('/:id', regularMeetingAttendancesController.update);
router.delete('/:id', regularMeetingAttendancesController.delete);

module.exports = router;

