const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { regularMeetingScheduleId, memberId } = req.query;
    const where = {};
    
    if (regularMeetingScheduleId) {
      where.regularMeetingScheduleId = parseInt(regularMeetingScheduleId);
    }
    if (memberId) {
      where.memberId = parseInt(memberId);
    }

    const attendances = await prisma.regularMeetingAttendance.findMany({
      where,
      include: {
        regularMeetingSchedule: true,
        member: {
          include: {
            memberLevel: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(attendances);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attendance = await prisma.regularMeetingAttendance.findUnique({
      where: { id: parseInt(id) },
      include: {
        regularMeetingSchedule: true,
        member: {
          include: {
            memberLevel: true,
            role: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new NotFoundError('Regular meeting attendance not found');
    }

    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { regularMeetingScheduleId, memberId, attendanceStatus, memo } = req.body;

    if (!regularMeetingScheduleId || !memberId || !attendanceStatus) {
      throw new BadRequestError('Regular meeting schedule ID, member ID, and attendance status are required');
    }

    const attendance = await prisma.regularMeetingAttendance.create({
      data: {
        regularMeetingScheduleId: parseInt(regularMeetingScheduleId),
        memberId: parseInt(memberId),
        attendanceStatus,
        memo,
      },
      include: {
        regularMeetingSchedule: true,
        member: true,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { attendanceStatus, memo } = req.body;

    const updateData = {};
    if (attendanceStatus !== undefined) updateData.attendanceStatus = attendanceStatus;
    if (memo !== undefined) updateData.memo = memo;

    const attendance = await prisma.regularMeetingAttendance.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        regularMeetingSchedule: true,
        member: true,
      },
    });

    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.regularMeetingAttendance.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Regular meeting attendance deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteAttendance,
};

