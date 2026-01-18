const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
    try {
        const performances = await prisma.performance.findMany({
            select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
                createdAt: true,
                _count: {
                    select: {
                        sessions: true,
                    },
                },
            },
            orderBy: {
                startDate: 'desc',
            },
        });
        res.status(200).json(performances);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const performance = await prisma.performance.findUnique({
            where: { id: parseInt(id) },
            include: {
                sessions: {
                    include: {
                        performanceMembers: {
                            include: {
                                member: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        if (!performance) {
            throw new NotFoundError('Performance not found');
        }

        res.status(200).json(performance);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const { title, startDate, endDate, sessions } = req.body;

        if (!title || !startDate || !endDate) {
            throw new BadRequestError('Title, start date, and end date are required');
        }

        // 회차 데이터 준비
        const sessionData = sessions && Array.isArray(sessions) ? sessions.map(session => {
            const sessionObj = {
                sessionDatetime: new Date(session.sessionDatetime),
                note: session.note || null,
            };

            // 회차별 배우 정보 추가
            if (session.members && Array.isArray(session.members) && session.members.length > 0) {
                sessionObj.performanceMembers = {
                    create: session.members
                        .filter(member => member.memberId && member.roleId)
                        .map(member => ({
                            memberId: parseInt(member.memberId),
                            roleId: parseInt(member.roleId),
                            characterName: member.characterName || null,
                        })),
                };
            }

            return sessionObj;
        }) : [];

        const performance = await prisma.performance.create({
            data: {
                title,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                sessions: {
                    create: sessionData,
                },
            },
            include: {
                sessions: {
                    include: {
                        performanceMembers: {
                            include: {
                                member: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(201).json(performance);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, startDate, endDate, sessions } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);

        // 회차 정보 업데이트
        if (sessions !== undefined && Array.isArray(sessions)) {
            // 기존 회차 모두 삭제 (PerformanceMember도 cascade로 삭제됨)
            await prisma.performanceSession.deleteMany({
                where: { performanceId: parseInt(id) },
            });

            // 새로운 회차 생성
            const sessionData = sessions
                .filter(session => session.sessionDatetime)
                .map(session => {
                    const sessionObj = {
                        sessionDatetime: new Date(session.sessionDatetime),
                        note: session.note || null,
                    };

                    // 회차별 배우 정보 추가
                    if (session.members && Array.isArray(session.members) && session.members.length > 0) {
                        sessionObj.performanceMembers = {
                            create: session.members
                                .filter(member => member.memberId && member.roleId)
                                .map(member => ({
                                    memberId: parseInt(member.memberId),
                                    roleId: parseInt(member.roleId),
                                    characterName: member.characterName || null,
                                })),
                        };
                    }

                    return sessionObj;
                });

            if (sessionData.length > 0) {
                updateData.sessions = {
                    create: sessionData,
                };
            }
        }

        const performance = await prisma.performance.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                sessions: {
                    orderBy: {
                        sessionDatetime: 'asc',
                    },
                    include: {
                        performanceMembers: {
                            include: {
                                member: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json(performance);
    } catch (error) {
        next(error);
    }
};

const deletePerformance = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.performance.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Performance deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deletePerformance,
};

