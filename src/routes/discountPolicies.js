const express = require("express");
const router = express.Router();
const discountPoliciesController = require("../controllers/discountPoliciesController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/discount-policies:
 *   get:
 *     summary: 할인 정책 목록 조회 (관리자 전용)
 *     tags: [Discount Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: 활성화 여부로 필터링
 *     responses:
 *       200:
 *         description: 할인 정책 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DiscountPolicy"
 *   post:
 *     summary: 할인 정책 생성 (관리자 전용)
 *     tags: [Discount Policies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - discountType
 *               - discountValue
 *             properties:
 *               name:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [RATE, FIXED]
 *               discountValue:
 *                 type: number
 *                 format: decimal
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: 할인 정책 생성 성공
 */
router.get("/", discountPoliciesController.getAll);
router.post("/", discountPoliciesController.create);

/**
 * @swagger
 * /api/v1/discount-policies/{id}:
 *   get:
 *     summary: 할인 정책 상세 조회 (관리자 전용)
 *     tags: [Discount Policies]
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
 *         description: 할인 정책 상세 조회 성공
 *       404:
 *         description: 할인 정책을 찾을 수 없음
 *   put:
 *     summary: 할인 정책 수정 (관리자 전용)
 *     tags: [Discount Policies]
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
 *               name:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [RATE, FIXED]
 *               discountValue:
 *                 type: number
 *                 format: decimal
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 할인 정책 수정 성공
 *   delete:
 *     summary: 할인 정책 삭제 (관리자 전용)
 *     tags: [Discount Policies]
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
 *         description: 할인 정책 삭제 성공
 */
router.get("/:id", discountPoliciesController.getById);
router.put("/:id", discountPoliciesController.update);
router.delete("/:id", discountPoliciesController.delete);

module.exports = router;

