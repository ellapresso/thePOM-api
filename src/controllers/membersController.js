const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
    try {
        const { profileVisible, memberLevelId, name } = req.query;
        const where = {};

        if (profileVisible !== undefined) {
            where.profileVisible = profileVisible === 'true';
        }
        if (memberLevelId) {
            where.memberLevelId = parseInt(memberLevelId);
        }
        if (name) {
            // MySQL에서는 contains가 LIKE 연산자로 변환됨
            where.name = {
                contains: name,
            };
        }

        const members = await prisma.member.findMany({
            where,
            include: {
                memberLevel: true,
            },
        });


        res.status(200).json(members);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const member = await prisma.member.findUnique({
            where: { id: parseInt(id) },
            include: {
                memberLevel: true,
            },
        });

        if (!member) {
            throw new NotFoundError('Member not found');
        }

        res.status(200).json(member);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const { name, birthDate, phone, memberLevelId, profileVisible, firstJoinedAt } = req.body;

        if (!name || !birthDate || !memberLevelId || !firstJoinedAt) {
            throw new BadRequestError('Name, birth date, member level ID, and first joined date are required');
        }

        const member = await prisma.member.create({
            data: {
                name,
                birthDate: new Date(birthDate),
                phone: phone || null,
                memberLevelId: parseInt(memberLevelId),
                profileVisible: profileVisible !== undefined ? profileVisible : true,
                firstJoinedAt: new Date(firstJoinedAt),
            },
            include: {
                memberLevel: true,
            },
        });

        res.status(201).json(member);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, birthDate, phone, memberLevelId, profileVisible, firstJoinedAt } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (birthDate) updateData.birthDate = new Date(birthDate);
        if (phone !== undefined) updateData.phone = phone || null;
        if (memberLevelId) updateData.memberLevelId = parseInt(memberLevelId);
        if (profileVisible !== undefined) updateData.profileVisible = profileVisible;
        if (firstJoinedAt) updateData.firstJoinedAt = new Date(firstJoinedAt);

        const member = await prisma.member.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                memberLevel: true,
            },
        });

        res.status(200).json(member);
    } catch (error) {
        next(error);
    }
};

const deleteMember = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.member.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteMember,
};

