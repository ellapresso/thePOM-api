const express = require("express");
const router = express.Router();
const rentalPaymentsController = require("../controllers/rentalPaymentsController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/rental-payments:
 *   get:
 *     summary: 대관비 납부 목록 조회 (관리자 전용)
 *     tags: [Rental Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rentalScheduleId
 *         schema:
 *           type: integer
 *         description: 대관 스케줄 ID로 필터링
 *     responses:
 *       200:
 *         description: 대관비 납부 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/RentalPayment"
 *   post:
 *     summary: 대관비 납부 생성 (관리자 전용)
 *     tags: [Rental Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rentalScheduleId
 *               - originalAmount
 *               - paidAmount
 *             properties:
 *               rentalScheduleId:
 *                 type: integer
 *               originalAmount:
 *                 type: number
 *                 format: decimal
 *               paidAmount:
 *                 type: number
 *                 format: decimal
 *               paymentMethod:
 *                 type: string
 *               paidAt:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: 대관비 납부 생성 성공
 */
router.get("/", rentalPaymentsController.getAll);
router.post("/", rentalPaymentsController.create);

/**
 * @swagger
 * /api/v1/rental-payments/{id}:
 *   get:
 *     summary: 대관비 납부 상세 조회 (관리자 전용)
 *     tags: [Rental Payments]
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
 *         description: 대관비 납부 상세 조회 성공
 *       404:
 *         description: 대관비 납부를 찾을 수 없음
 *   put:
 *     summary: 대관비 납부 수정 (관리자 전용)
 *     tags: [Rental Payments]
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
 *               originalAmount:
 *                 type: number
 *                 format: decimal
 *               paidAmount:
 *                 type: number
 *                 format: decimal
 *               paymentMethod:
 *                 type: string
 *               paidAt:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: 대관비 납부 수정 성공
 *   delete:
 *     summary: 대관비 납부 삭제 (관리자 전용)
 *     tags: [Rental Payments]
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
 *         description: 대관비 납부 삭제 성공
 */
router.get("/:id", rentalPaymentsController.getById);
router.put("/:id", rentalPaymentsController.update);
router.delete("/:id", rentalPaymentsController.delete);

module.exports = router;

