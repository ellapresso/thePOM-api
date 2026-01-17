const express = require("express");
const router = express.Router();
const membershipFeePaymentsController = require("../controllers/membershipFeePaymentsController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/membership-fee-payments:
 *   get:
 *     summary: 회비 납부 목록 조회 (관리자 전용)
 *     tags: [Membership Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: memberLevelId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: targetYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: targetMonth
 *         schema:
 *           type: integer
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [UNPAID, PARTIAL, PAID]
 *     responses:
 *       200:
 *         description: 회비 납부 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MembershipFeePayment"
 *   post:
 *     summary: 회비 납부 생성 (관리자 전용)
 *     tags: [Membership Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberId
 *               - memberLevelId
 *               - targetYear
 *               - targetMonth
 *               - originalAmount
 *               - paidAmount
 *               - paymentStatus
 *             properties:
 *               memberId:
 *                 type: integer
 *               memberLevelId:
 *                 type: integer
 *               targetYear:
 *                 type: integer
 *               targetMonth:
 *                 type: integer
 *               originalAmount:
 *                 type: number
 *                 format: decimal
 *               paidAmount:
 *                 type: number
 *                 format: decimal
 *               paymentStatus:
 *                 type: string
 *                 enum: [UNPAID, PARTIAL, PAID]
 *               paymentMethod:
 *                 type: string
 *               paidAt:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회비 납부 생성 성공
 */
router.get("/", membershipFeePaymentsController.getAll);
router.post("/", membershipFeePaymentsController.create);

/**
 * @swagger
 * /api/v1/membership-fee-payments/{id}:
 *   get:
 *     summary: 회비 납부 상세 조회 (관리자 전용)
 *     tags: [Membership Fee Payments]
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
 *         description: 회비 납부 상세 조회 성공
 *       404:
 *         description: 회비 납부를 찾을 수 없음
 *   put:
 *     summary: 회비 납부 수정 (관리자 전용)
 *     tags: [Membership Fee Payments]
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
 *               memberLevelId:
 *                 type: integer
 *               originalAmount:
 *                 type: number
 *                 format: decimal
 *               paidAmount:
 *                 type: number
 *                 format: decimal
 *               paymentStatus:
 *                 type: string
 *                 enum: [UNPAID, PARTIAL, PAID]
 *               paymentMethod:
 *                 type: string
 *               paidAt:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: 회비 납부 수정 성공
 *   delete:
 *     summary: 회비 납부 삭제 (관리자 전용)
 *     tags: [Membership Fee Payments]
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
 *         description: 회비 납부 삭제 성공
 */
router.get("/:id", membershipFeePaymentsController.getById);
router.put("/:id", membershipFeePaymentsController.update);
router.delete("/:id", membershipFeePaymentsController.delete);

module.exports = router;

