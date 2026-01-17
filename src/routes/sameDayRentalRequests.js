const express = require('express');
const router = express.Router();
const sameDayRentalRequestsController = require('../controllers/sameDayRentalRequestsController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// 관리자 전용
router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/same-day-rental-requests:
 *   get:
 *     summary: 당일 대관 신청 목록 조회 (관리자 전용)
 *     tags: [Same Day Rental Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: applicantMemberId
 *         schema:
 *           type: integer
 *         description: 신청자 단원 ID로 필터링
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: 상태로 필터링
 *       - in: query
 *         name: rentalDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 대관 날짜로 필터링
 *     responses:
 *       200:
 *         description: 당일 대관 신청 목록 조회 성공
 *   post:
 *     summary: 당일 대관 신청 생성 (관리자 전용)
 *     tags: [Same Day Rental Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicantMemberId
 *               - rentalDate
 *               - rentalStartTime
 *               - rentalEndTime
 *             properties:
 *               applicantMemberId:
 *                 type: integer
 *               requestedAt:
 *                 type: string
 *                 format: date-time
 *               rentalDate:
 *                 type: string
 *                 format: date
 *               rentalStartTime:
 *                 type: string
 *                 format: time
 *               rentalEndTime:
 *                 type: string
 *                 format: time
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 default: pending
 *     responses:
 *       201:
 *         description: 당일 대관 신청 생성 성공
 */
router.get('/', sameDayRentalRequestsController.getAll);
router.post('/', sameDayRentalRequestsController.create);

/**
 * @swagger
 * /api/v1/same-day-rental-requests/{id}:
 *   get:
 *     summary: 당일 대관 신청 상세 조회 (관리자 전용)
 *     tags: [Same Day Rental Requests]
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
 *         description: 당일 대관 신청 상세 조회 성공
 *   put:
 *     summary: 당일 대관 신청 수정 (관리자 전용)
 *     tags: [Same Day Rental Requests]
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
 *               rentalDate:
 *                 type: string
 *                 format: date
 *               rentalStartTime:
 *                 type: string
 *                 format: time
 *               rentalEndTime:
 *                 type: string
 *                 format: time
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: 당일 대관 신청 수정 성공
 *   delete:
 *     summary: 당일 대관 신청 삭제 (관리자 전용)
 *     tags: [Same Day Rental Requests]
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
 *         description: 당일 대관 신청 삭제 성공
 */
router.get('/:id', sameDayRentalRequestsController.getById);
router.put('/:id', sameDayRentalRequestsController.update);
router.delete('/:id', sameDayRentalRequestsController.delete);

/**
 * @swagger
 * /api/v1/same-day-rental-requests/{id}/approve:
 *   post:
 *     summary: 당일 대관 신청 승인 및 rental_schedules 생성 (관리자 전용)
 *     tags: [Same Day Rental Requests]
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
 *               renterName:
 *                 type: string
 *               purpose:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: 승인 완료 및 대관 스케줄 생성 성공
 */
router.post('/:id/approve', sameDayRentalRequestsController.approve);

module.exports = router;

