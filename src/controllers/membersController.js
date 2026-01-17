const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
    try {
        const { profileVisible, memberLevelId, roleId, name } = req.query;
        const where = {};

        if (profileVisible !== undefined) {
            where.profileVisible = profileVisible === 'true';
        }
        if (memberLevelId) {
            where.memberLevelId = parseInt(memberLevelId);
        }
        if (roleId) {
            where.roleId = parseInt(roleId);
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
                role: true,
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
                role: true,
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
        const { name, birthDate, phone, memberLevelId, roleId, profileVisible, firstJoinedAt } = req.body;

        if (!name || !birthDate || !memberLevelId || !firstJoinedAt) {
            throw new BadRequestError('Name, birth date, member level ID, and first joined date are required');
        }

        // roleId는 선택사항 (공연 관련 정보이므로 단원 등록 시 필수 아님)
        // roleId가 없으면 기본 역할을 찾거나 null로 설정
        let finalRoleId = null;
        if (roleId) {
            finalRoleId = parseInt(roleId);
        } else {
            // 기본 역할 찾기 (ACTOR 코드를 가진 역할)
            const defaultRole = await prisma.role.findFirst({
                where: { code: 'ACTOR' },
            });
            if (defaultRole) {
                finalRoleId = defaultRole.id;
            } else {
                // ACTOR 역할이 없으면 첫 번째 역할 사용
                const firstRole = await prisma.role.findFirst();
                if (firstRole) {
                    finalRoleId = firstRole.id;
                } else {
                    throw new BadRequestError('No roles available. Please create a role first.');
                }
            }
        }

        const member = await prisma.member.create({
            data: {
                name,
                birthDate: new Date(birthDate),
                phone: phone || null,
                memberLevelId: parseInt(memberLevelId),
                roleId: finalRoleId,
                profileVisible: profileVisible !== undefined ? profileVisible : true,
                firstJoinedAt: new Date(firstJoinedAt),
            },
            include: {
                memberLevel: true,
                role: true,
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
        const { name, birthDate, phone, memberLevelId, roleId, profileVisible, firstJoinedAt } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (birthDate) updateData.birthDate = new Date(birthDate);
        if (phone !== undefined) updateData.phone = phone || null;
        if (memberLevelId) updateData.memberLevelId = parseInt(memberLevelId);
        if (roleId) updateData.roleId = parseInt(roleId);
        if (profileVisible !== undefined) updateData.profileVisible = profileVisible;
        if (firstJoinedAt) updateData.firstJoinedAt = new Date(firstJoinedAt);

        const member = await prisma.member.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                memberLevel: true,
                role: true,
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

