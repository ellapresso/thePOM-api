const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
    try {
        const { renterType, startDate, endDate } = req.query;
        const where = {};

        if (renterType) {
            where.renterType = renterType;
        }
        if (startDate || endDate) {
            where.startDatetime = {};
            if (startDate) {
                where.startDatetime.gte = new Date(startDate);
            }
            if (endDate) {
                where.endDatetime = { lte: new Date(endDate) };
            }
        }

        const schedules = await prisma.rentalSchedule.findMany({
            where,
            orderBy: {
                startDatetime: 'asc',
            },
        });
        res.status(200).json(schedules);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const schedule = await prisma.rentalSchedule.findUnique({
            where: { id: parseInt(id) },
            include: {
                payments: true,
            },
        });

        if (!schedule) {
            throw new NotFoundError('Rental schedule not found');
        }

        res.status(200).json(schedule);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const { startDatetime, endDatetime, renterType, renterId, renterName, purpose, note } = req.body;

        if (!startDatetime || !endDatetime || !renterType || !renterName) {
            throw new BadRequestError('Start datetime, end datetime, renter type, and renter name are required');
        }

        const schedule = await prisma.rentalSchedule.create({
            data: {
                startDatetime: new Date(startDatetime),
                endDatetime: new Date(endDatetime),
                renterType,
                renterId: renterId ? parseInt(renterId) : null,
                renterName,
                purpose: purpose || null,
                note: note || null,
            },
            include: {
                payments: true,
            },
        });

        res.status(201).json(schedule);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { startDatetime, endDatetime, renterType, renterId, renterName, purpose, note } = req.body;

        const updateData = {};
        if (startDatetime) updateData.startDatetime = new Date(startDatetime);
        if (endDatetime) updateData.endDatetime = new Date(endDatetime);
        if (renterType) updateData.renterType = renterType;
        if (renterId !== undefined) updateData.renterId = renterId ? parseInt(renterId) : null;
        if (renterName) updateData.renterName = renterName;
        if (purpose !== undefined) updateData.purpose = purpose || null;
        if (note !== undefined) updateData.note = note || null;

        const schedule = await prisma.rentalSchedule.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                payments: true,
            },
        });

        res.status(200).json(schedule);
    } catch (error) {
        next(error);
    }
};

const deleteSchedule = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.rentalSchedule.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Rental schedule deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteSchedule,
};

