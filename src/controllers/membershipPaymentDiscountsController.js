const prisma = require("../config/database");
const { NotFoundError, BadRequestError } = require("../errors");

const getAll = async (req, res, next) => {
  try {
    const { membershipPaymentId } = req.query;
    const where = {};
    
    if (membershipPaymentId) {
      where.membershipPaymentId = parseInt(membershipPaymentId);
    }

    const discounts = await prisma.membershipPaymentDiscount.findMany({
      where,
      include: {
        membershipPayment: true,
        discountPolicy: true,
      },
    });
    res.status(200).json(discounts);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const discount = await prisma.membershipPaymentDiscount.findUnique({
      where: { id: parseInt(id) },
      include: {
        membershipPayment: true,
        discountPolicy: true,
      },
    });

    if (!discount) {
      throw new NotFoundError("Membership payment discount not found");
    }

    res.status(200).json(discount);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { membershipPaymentId, discountPolicyId, appliedAmount } = req.body;

    if (!membershipPaymentId || !discountPolicyId || appliedAmount === undefined) {
      throw new BadRequestError("Membership payment ID, discount policy ID, and applied amount are required");
    }

    const discount = await prisma.membershipPaymentDiscount.create({
      data: {
        membershipPaymentId: parseInt(membershipPaymentId),
        discountPolicyId: parseInt(discountPolicyId),
        appliedAmount: parseFloat(appliedAmount),
      },
      include: {
        membershipPayment: true,
        discountPolicy: true,
      },
    });

    res.status(201).json(discount);
  } catch (error) {
    next(error);
  }
};

const deleteDiscount = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.membershipPaymentDiscount.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Membership payment discount deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  delete: deleteDiscount,
};

