const prisma = require('../config/database');
const { NotFoundError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { performanceId } = req.query;
    const where = {};
    
    if (performanceId) {
      where.performanceId = parseInt(performanceId);
    }

    const sessions = await prisma.performanceSession.findMany({
      where,
      include: {
        performance: true,
        performanceMembers: {
          include: {
            member: true,
            role: true,
          },
        },
      },
    });
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await prisma.performanceSession.findUnique({
      where: { id: parseInt(id) },
      include: {
        performance: true,
        performanceMembers: {
          include: {
            member: true,
            role: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundError('Performance session not found');
    }

    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
};

