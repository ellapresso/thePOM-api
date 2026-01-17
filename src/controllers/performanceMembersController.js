const prisma = require('../config/database');
const { NotFoundError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { performanceSessionId, memberId } = req.query;
    const where = {};
    
    if (performanceSessionId) {
      where.performanceSessionId = parseInt(performanceSessionId);
    }
    if (memberId) {
      where.memberId = parseInt(memberId);
    }

    const performanceMembers = await prisma.performanceMember.findMany({
      where,
      include: {
        performanceSession: {
          include: {
            performance: true,
          },
        },
        member: true,
        role: true,
      },
    });
    res.status(200).json(performanceMembers);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const performanceMember = await prisma.performanceMember.findUnique({
      where: { id: parseInt(id) },
      include: {
        performanceSession: {
          include: {
            performance: true,
          },
        },
        member: true,
        role: true,
      },
    });

    if (!performanceMember) {
      throw new NotFoundError('Performance member not found');
    }

    res.status(200).json(performanceMember);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
};

