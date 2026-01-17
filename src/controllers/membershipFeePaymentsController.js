const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { memberId, memberLevelId, targetYear, targetMonth, paymentStatus } = req.query;
    const where = {};
    
    if (memberId) where.memberId = parseInt(memberId);
    if (memberLevelId) where.memberLevelId = parseInt(memberLevelId);
    if (targetYear) where.targetYear = parseInt(targetYear);
    if (targetMonth) where.targetMonth = parseInt(targetMonth);
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const payments = await prisma.membershipFeePayment.findMany({
      where,
      include: {
        member: true,
        memberLevel: true,
        discounts: {
          include: {
            discountPolicy: true,
          },
        },
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await prisma.membershipFeePayment.findUnique({
      where: { id: parseInt(id) },
      include: {
        member: true,
        memberLevel: true,
        discounts: {
          include: {
            discountPolicy: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundError('Membership fee payment not found');
    }

    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { memberId, memberLevelId, targetYear, targetMonth, originalAmount, paidAmount, paymentStatus, paymentMethod, paidAt, note } = req.body;

    if (!memberId || !memberLevelId || !targetYear || !targetMonth || !originalAmount || !paidAmount || !paymentStatus) {
      throw new BadRequestError('Required fields are missing');
    }

    const payment = await prisma.membershipFeePayment.create({
      data: {
        memberId: parseInt(memberId),
        memberLevelId: parseInt(memberLevelId),
        targetYear: parseInt(targetYear),
        targetMonth: parseInt(targetMonth),
        originalAmount: parseFloat(originalAmount),
        paidAmount: parseFloat(paidAmount),
        paymentStatus,
        paymentMethod,
        paidAt: paidAt ? new Date(paidAt) : null,
        note,
      },
      include: {
        member: true,
        memberLevel: true,
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { memberLevelId, originalAmount, paidAmount, paymentStatus, paymentMethod, paidAt, note } = req.body;

    const updateData = {};
    if (memberLevelId !== undefined) updateData.memberLevelId = parseInt(memberLevelId);
    if (originalAmount !== undefined) updateData.originalAmount = parseFloat(originalAmount);
    if (paidAmount !== undefined) updateData.paidAmount = parseFloat(paidAmount);
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (paidAt !== undefined) updateData.paidAt = paidAt ? new Date(paidAt) : null;
    if (note !== undefined) updateData.note = note;

    const payment = await prisma.membershipFeePayment.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        member: true,
        memberLevel: true,
      },
    });

    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.membershipFeePayment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Membership fee payment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deletePayment,
};

