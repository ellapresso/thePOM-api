const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
    try {
        const performances = await prisma.performance.findMany({
            include: {
                sessions: true,
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
        const { title, startDate, endDate } = req.body;

        if (!title || !startDate || !endDate) {
            throw new BadRequestError('Title, start date, and end date are required');
        }

        const performance = await prisma.performance.create({
            data: {
                title,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
            include: {
                sessions: true,
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
        const { title, startDate, endDate } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);

        const performance = await prisma.performance.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                sessions: true,
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

