const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { rentalPaymentId } = req.query;
    const where = {};
    
    if (rentalPaymentId) {
      where.rentalPaymentId = parseInt(rentalPaymentId);
    }

    const discounts = await prisma.rentalPaymentDiscount.findMany({
      where,
      include: {
        rentalPayment: true,
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
    const discount = await prisma.rentalPaymentDiscount.findUnique({
      where: { id: parseInt(id) },
      include: {
        rentalPayment: true,
        discountPolicy: true,
      },
    });

    if (!discount) {
      throw new NotFoundError('Rental payment discount not found');
    }

    res.status(200).json(discount);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { rentalPaymentId, discountPolicyId, appliedAmount } = req.body;

    if (!rentalPaymentId || !discountPolicyId || appliedAmount === undefined) {
      throw new BadRequestError('Rental payment ID, discount policy ID, and applied amount are required');
    }

    const discount = await prisma.rentalPaymentDiscount.create({
      data: {
        rentalPaymentId: parseInt(rentalPaymentId),
        discountPolicyId: parseInt(discountPolicyId),
        appliedAmount: parseFloat(appliedAmount),
      },
      include: {
        rentalPayment: true,
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
    await prisma.rentalPaymentDiscount.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Rental payment discount deleted successfully' });
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

