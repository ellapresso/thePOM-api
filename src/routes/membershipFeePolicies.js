const express = require('express');
const router = express.Router();
const membershipFeePoliciesController = require('../controllers/membershipFeePoliciesController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/v1/membership-fee-policies:
 *   get:
 *     summary: 회비 정책 목록 조회 (관리자 전용)
 *     tags: [Membership Fee Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: memberLevelId
 *         schema:
 *           type: integer
 *         description: 단원 레벨 ID로 필터링
 *     responses:
 *       200:
 *         description: 회비 정책 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MembershipFeePolicy'
 *   post:
 *     summary: 회비 정책 생성 (관리자 전용)
 *     tags: [Membership Fee Policies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberLevelId
 *               - baseAmount
 *             properties:
 *               memberLevelId:
 *                 type: integer
 *               baseAmount:
 *                 type: number
 *                 format: decimal
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회비 정책 생성 성공
 */
router.get('/', membershipFeePoliciesController.getAll);
router.post('/', membershipFeePoliciesController.create);

/**
 * @swagger
 * /api/v1/membership-fee-policies/{id}:
 *   get:
 *     summary: 회비 정책 상세 조회 (관리자 전용)
 *     tags: [Membership Fee Policies]
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
 *         description: 회비 정책 상세 조회 성공
 *       404:
 *         description: 회비 정책을 찾을 수 없음
 *   put:
 *     summary: 회비 정책 수정 (관리자 전용)
 *     tags: [Membership Fee Policies]
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
 *               baseAmount:
 *                 type: number
 *                 format: decimal
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 회비 정책 수정 성공
 *   delete:
 *     summary: 회비 정책 삭제 (관리자 전용)
 *     tags: [Membership Fee Policies]
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
 *         description: 회비 정책 삭제 성공
 */
router.get('/:id', membershipFeePoliciesController.getById);
router.put('/:id', membershipFeePoliciesController.update);
router.delete('/:id', membershipFeePoliciesController.delete);

module.exports = router;

