const prisma = require('../config/database');
const { NotFoundError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany();
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
    });

    if (!role) {
      throw new NotFoundError('Role not found');
    }

    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
};

