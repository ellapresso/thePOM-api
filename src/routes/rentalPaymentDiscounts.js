const express = require("express");
const router = express.Router();
const rentalPaymentDiscountsController = require("../controllers/rentalPaymentDiscountsController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/rental-payment-discounts:
 *   get:
 *     summary: 대관 할인 적용 로그 목록 조회 (관리자 전용)
 *     tags: [Rental Payment Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rentalPaymentId
 *         schema:
 *           type: integer
 *         description: 대관비 납부 ID로 필터링
 *     responses:
 *       200:
 *         description: 대관 할인 로그 목록 조회 성공
 *   post:
 *     summary: 대관 할인 적용 로그 생성 (관리자 전용, 수정 불가)
 *     tags: [Rental Payment Discounts]
 *     security:
 *       - bearerAuth: []
 *     description: 회계 이력 로그이므로 수정 불가
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rentalPaymentId
 *               - discountPolicyId
 *               - appliedAmount
 *             properties:
 *               rentalPaymentId:
 *                 type: integer
 *               discountPolicyId:
 *                 type: integer
 *               appliedAmount:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       201:
 *         description: 대관 할인 로그 생성 성공
 */
router.get("/", rentalPaymentDiscountsController.getAll);
router.post("/", rentalPaymentDiscountsController.create);

/**
 * @swagger
 * /api/v1/rental-payment-discounts/{id}:
 *   get:
 *     summary: 대관 할인 적용 로그 상세 조회 (관리자 전용)
 *     tags: [Rental Payment Discounts]
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
 *         description: 대관 할인 로그 상세 조회 성공
 *       404:
 *         description: 대관 할인 로그를 찾을 수 없음
 *   delete:
 *     summary: 대관 할인 적용 로그 삭제 (관리자 전용)
 *     tags: [Rental Payment Discounts]
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
 *         description: 대관 할인 로그 삭제 성공
 */
router.get("/:id", rentalPaymentDiscountsController.getById);
router.delete("/:id", rentalPaymentDiscountsController.delete);

module.exports = router;

