const express = require("express");
const router = express.Router();
const membershipPaymentDiscountsController = require("../controllers/membershipPaymentDiscountsController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/membership-payment-discounts:
 *   get:
 *     summary: 회비 할인 적용 로그 목록 조회 (관리자 전용)
 *     tags: [Membership Payment Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: membershipPaymentId
 *         schema:
 *           type: integer
 *         description: 회비 납부 ID로 필터링
 *     responses:
 *       200:
 *         description: 회비 할인 로그 목록 조회 성공
 *   post:
 *     summary: 회비 할인 적용 로그 생성 (관리자 전용, 수정 불가)
 *     tags: [Membership Payment Discounts]
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
 *               - membershipPaymentId
 *               - discountPolicyId
 *               - appliedAmount
 *             properties:
 *               membershipPaymentId:
 *                 type: integer
 *               discountPolicyId:
 *                 type: integer
 *               appliedAmount:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       201:
 *         description: 회비 할인 로그 생성 성공
 */
router.get("/", membershipPaymentDiscountsController.getAll);
router.post("/", membershipPaymentDiscountsController.create);

/**
 * @swagger
 * /api/v1/membership-payment-discounts/{id}:
 *   get:
 *     summary: 회비 할인 적용 로그 상세 조회 (관리자 전용)
 *     tags: [Membership Payment Discounts]
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
 *         description: 회비 할인 로그 상세 조회 성공
 *       404:
 *         description: 회비 할인 로그를 찾을 수 없음
 *   delete:
 *     summary: 회비 할인 적용 로그 삭제 (관리자 전용)
 *     tags: [Membership Payment Discounts]
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
 *         description: 회비 할인 로그 삭제 성공
 */
router.get("/:id", membershipPaymentDiscountsController.getById);
router.delete("/:id", membershipPaymentDiscountsController.delete);

module.exports = router;

