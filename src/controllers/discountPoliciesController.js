const prisma = require("../config/database");
const { NotFoundError, BadRequestError } = require("../errors");

const getAll = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const where = {};
    
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const policies = await prisma.discountPolicy.findMany({
      where,
    });
    res.status(200).json(policies);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const policy = await prisma.discountPolicy.findUnique({
      where: { id: parseInt(id) },
    });

    if (!policy) {
      throw new NotFoundError("Discount policy not found");
    }

    res.status(200).json(policy);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, discountType, discountValue, description, isActive } = req.body;

    if (!name || !discountType || discountValue === undefined) {
      throw new BadRequestError("Name, discount type, and discount value are required");
    }

    const policy = await prisma.discountPolicy.create({
      data: {
        name,
        discountType,
        discountValue: parseFloat(discountValue),
        description,
        isActive: isActive !== undefined ? isActive : true,
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
    const { name, discountType, discountValue, description, isActive } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (discountType !== undefined) updateData.discountType = discountType;
    if (discountValue !== undefined) updateData.discountValue = parseFloat(discountValue);
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const policy = await prisma.discountPolicy.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(policy);
  } catch (error) {
    next(error);
  }
};

const deletePolicy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.discountPolicy.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Discount policy deleted successfully" });
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

