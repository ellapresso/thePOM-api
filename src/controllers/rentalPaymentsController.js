const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { rentalScheduleId } = req.query;
    const where = {};
    
    if (rentalScheduleId) {
      where.rentalScheduleId = parseInt(rentalScheduleId);
    }

    const payments = await prisma.rentalPayment.findMany({
      where,
      include: {
        rentalSchedule: true,
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
    const payment = await prisma.rentalPayment.findUnique({
      where: { id: parseInt(id) },
      include: {
        rentalSchedule: true,
        discounts: {
          include: {
            discountPolicy: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundError('Rental payment not found');
    }

    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { rentalScheduleId, originalAmount, paidAmount, paymentMethod, paidAt, note } = req.body;

    if (!rentalScheduleId || !originalAmount || !paidAmount) {
      throw new BadRequestError('Rental schedule ID, original amount, and paid amount are required');
    }

    const payment = await prisma.rentalPayment.create({
      data: {
        rentalScheduleId: parseInt(rentalScheduleId),
        originalAmount: parseFloat(originalAmount),
        paidAmount: parseFloat(paidAmount),
        paymentMethod,
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        note,
      },
      include: {
        rentalSchedule: true,
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
    const { originalAmount, paidAmount, paymentMethod, paidAt, note } = req.body;

    const updateData = {};
    if (originalAmount !== undefined) updateData.originalAmount = parseFloat(originalAmount);
    if (paidAmount !== undefined) updateData.paidAmount = parseFloat(paidAmount);
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (paidAt !== undefined) updateData.paidAt = new Date(paidAt);
    if (note !== undefined) updateData.note = note;

    const payment = await prisma.rentalPayment.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        rentalSchedule: true,
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
    await prisma.rentalPayment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Rental payment deleted successfully' });
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

