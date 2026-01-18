const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { meetingDate } = req.query;
    const where = {};
    
    if (meetingDate) {
      where.meetingDate = new Date(meetingDate);
    }

    const schedules = await prisma.regularMeetingSchedule.findMany({
      where,
      select: {
        id: true,
        meetingName: true,
        meetingDate: true,
        startTime: true,
        endTime: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attendances: true,
          },
        },
      },
      orderBy: {
        meetingDate: 'desc',
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
    const schedule = await prisma.regularMeetingSchedule.findUnique({
      where: { id: parseInt(id) },
      include: {
        manager: true,
        attendances: {
          include: {
            member: true,
          },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundError('Regular meeting schedule not found');
    }

    res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { meetingName, meetingDate, startTime, endTime, managerId } = req.body;

    if (!meetingName || !meetingDate || !startTime || !endTime) {
      throw new BadRequestError('Meeting name, date, start time, and end time are required');
    }

    // 날짜와 시간을 결합
    const meetingDateTime = new Date(meetingDate);
    const startDateTime = new Date(`${meetingDate}T${startTime}`);
    const endDateTime = new Date(`${meetingDate}T${endTime}`);

    const schedule = await prisma.regularMeetingSchedule.create({
      data: {
        meetingName,
        meetingDate: meetingDateTime,
        startTime: startDateTime,
        endTime: endDateTime,
        managerId: managerId ? parseInt(managerId) : null,
      },
      include: {
        manager: true,
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
    const { meetingName, meetingDate, startTime, endTime, managerId } = req.body;

    const updateData = {};
    if (meetingName !== undefined) updateData.meetingName = meetingName;
    if (meetingDate !== undefined) {
      updateData.meetingDate = new Date(meetingDate);
    }
    if (startTime !== undefined || endTime !== undefined) {
      // meetingDate가 없으면 기존 데이터 조회 (한 번만)
      let currentSchedule = null;
      if (!meetingDate) {
        currentSchedule = await prisma.regularMeetingSchedule.findUnique({
          where: { id: parseInt(id) },
          select: { meetingDate: true },
        });
      }
      const date = meetingDate || currentSchedule?.meetingDate;
      
      if (startTime !== undefined && date) {
        updateData.startTime = new Date(`${date}T${startTime}`);
      }
      if (endTime !== undefined && date) {
        updateData.endTime = new Date(`${date}T${endTime}`);
      }
    }
    if (managerId !== undefined) {
      updateData.managerId = managerId ? parseInt(managerId) : null;
    }

    const schedule = await prisma.regularMeetingSchedule.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        manager: true,
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
    await prisma.regularMeetingSchedule.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Regular meeting schedule deleted successfully' });
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

