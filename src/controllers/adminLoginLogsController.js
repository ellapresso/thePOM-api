const prisma = require("../config/database");
const { NotFoundError } = require("../errors");

const getAll = async (req, res, next) => {
  try {
    const { adminId, success } = req.query;
    const where = {};
    
    if (adminId) {
      where.adminId = parseInt(adminId);
    }
    if (success !== undefined) {
      where.success = success === "true";
    }

    const logs = await prisma.adminLoginLog.findMany({
      where,
      include: {
        admin: true,
      },
      orderBy: {
        loginAt: "desc",
      },
    });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await prisma.adminLoginLog.findUnique({
      where: { id: parseInt(id) },
      include: {
        admin: true,
      },
    });

    if (!log) {
      throw new NotFoundError("Admin login log not found");
    }

    res.status(200).json(log);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
};

