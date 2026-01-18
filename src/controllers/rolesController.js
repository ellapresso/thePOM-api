const prisma = require('../config/database');
const { NotFoundError, BadRequestError, ConflictError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { id: 'asc' },
    });
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

const create = async (req, res, next) => {
  try {
    const { code, name, description } = req.body;

    if (!code || !name) {
      throw new BadRequestError('Code and name are required');
    }

    // code 중복 확인
    const existingRole = await prisma.role.findFirst({
      where: { code },
    });

    if (existingRole) {
      throw new ConflictError('Role code already exists');
    }

    const role = await prisma.role.create({
      data: {
        code,
        name,
        description: description || null,
      },
    });

    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, description } = req.body;

    // 역할 존재 확인
    const existingRole = await prisma.role.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRole) {
      throw new NotFoundError('Role not found');
    }

    // code 변경 시 중복 확인
    if (code && code !== existingRole.code) {
      const duplicateRole = await prisma.role.findFirst({
        where: { code },
      });

      if (duplicateRole) {
        throw new ConflictError('Role code already exists');
      }
    }

    const updateData = {};
    if (code !== undefined) updateData.code = code;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;

    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 역할 존재 확인
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: {
        performanceMembers: true,
      },
    });

    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // 해당 역할을 사용하는 performanceMember가 있는지 확인
    if (role.performanceMembers && role.performanceMembers.length > 0) {
      throw new BadRequestError('Cannot delete role that is in use by performance members');
    }

    await prisma.role.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteRole,
};

