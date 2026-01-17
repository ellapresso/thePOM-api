const prisma = require('../config/database');
const { NotFoundError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const memberLevels = await prisma.memberLevel.findMany();
    res.status(200).json(memberLevels);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const memberLevel = await prisma.memberLevel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!memberLevel) {
      throw new NotFoundError('Member level not found');
    }

    res.status(200).json(memberLevel);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
};

