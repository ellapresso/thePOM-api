const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const memberLevels = await prisma.memberLevel.findMany({
      orderBy: { id: 'asc' },
    });
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

const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new BadRequestError('Name is required');
    }

    const memberLevel = await prisma.memberLevel.create({
      data: {
        name,
        description: description || null,
      },
    });

    res.status(201).json(memberLevel);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // 레벨 존재 확인
    const existingLevel = await prisma.memberLevel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingLevel) {
      throw new NotFoundError('Member level not found');
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;

    const memberLevel = await prisma.memberLevel.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(memberLevel);
  } catch (error) {
    next(error);
  }
};

const deleteMemberLevel = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 레벨 존재 확인
    const memberLevel = await prisma.memberLevel.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: true,
      },
    });

    if (!memberLevel) {
      throw new NotFoundError('Member level not found');
    }

    // 해당 레벨을 사용하는 멤버가 있는지 확인
    if (memberLevel.members && memberLevel.members.length > 0) {
      throw new BadRequestError('Cannot delete member level that is in use by members');
    }

    await prisma.memberLevel.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Member level deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteMemberLevel,
};

