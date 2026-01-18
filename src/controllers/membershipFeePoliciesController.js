const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { memberLevelId } = req.query;
    const where = {};
    
    if (memberLevelId) {
      where.memberLevelId = parseInt(memberLevelId);
    }

    const policies = await prisma.membershipFeePolicy.findMany({
      where,
      include: {
        memberLevel: true,
      },
    });
    res.status(200).json(policies);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const policy = await prisma.membershipFeePolicy.findUnique({
      where: { id: parseInt(id) },
      include: {
        memberLevel: true,
      },
    });

    if (!policy) {
      throw new NotFoundError('Membership fee policy not found');
    }

    res.status(200).json(policy);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { memberLevelId, baseAmount, description } = req.body;

    if (!memberLevelId || baseAmount === undefined || baseAmount === null || baseAmount === '') {
      throw new BadRequestError('Member level ID and base amount are required');
    }

    const baseAmountNum = parseFloat(baseAmount);
    if (isNaN(baseAmountNum) || baseAmountNum < 0) {
      throw new BadRequestError('Base amount must be a valid number greater than or equal to 0');
    }

    const policy = await prisma.membershipFeePolicy.create({
      data: {
        memberLevelId: parseInt(memberLevelId),
        baseAmount: baseAmountNum,
        description,
      },
      include: {
        memberLevel: true,
      },
    });

    res.status(201).json(policy);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { memberLevelId, baseAmount, description } = req.body;

    const updateData = {};
    if (memberLevelId !== undefined) updateData.memberLevelId = parseInt(memberLevelId);
    if (baseAmount !== undefined) updateData.baseAmount = parseFloat(baseAmount);
    if (description !== undefined) updateData.description = description;

    const policy = await prisma.membershipFeePolicy.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        memberLevel: true,
      },
    });

    res.status(200).json(policy);
  } catch (error) {
    next(error);
  }
};

const deletePolicy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.membershipFeePolicy.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Membership fee policy deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deletePolicy,
};

