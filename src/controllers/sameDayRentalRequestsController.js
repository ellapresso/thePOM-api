const prisma = require('../config/database');
const { NotFoundError, BadRequestError } = require('../errors');

const getAll = async (req, res, next) => {
  try {
    const { applicantMemberId, status, rentalDate } = req.query;
    const where = {};
    
    if (applicantMemberId) {
      where.applicantMemberId = parseInt(applicantMemberId);
    }
    if (status) {
      where.status = status;
    }
    if (rentalDate) {
      where.rentalDate = new Date(rentalDate);
    }

    const requests = await prisma.sameDayRentalRequest.findMany({
      where,
      include: {
        applicantMember: {
          include: {
            memberLevel: true,
            role: true,
          },
        },
        rentalSchedule: true,
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await prisma.sameDayRentalRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        applicantMember: {
          include: {
            memberLevel: true,
            role: true,
          },
        },
        rentalSchedule: true,
      },
    });

    if (!request) {
      throw new NotFoundError('Same day rental request not found');
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { applicantMemberId, requestedAt, rentalDate, rentalStartTime, rentalEndTime, status } = req.body;

    if (!applicantMemberId || !rentalDate || !rentalStartTime || !rentalEndTime) {
      throw new BadRequestError('Applicant member ID, rental date, start time, and end time are required');
    }

    // 날짜와 시간을 결합하여 DATETIME 생성
    const rentalStartDateTime = new Date(`${rentalDate}T${rentalStartTime}`);
    const rentalEndDateTime = new Date(`${rentalDate}T${rentalEndTime}`);

    const request = await prisma.sameDayRentalRequest.create({
      data: {
        applicantMemberId: parseInt(applicantMemberId),
        requestedAt: requestedAt ? new Date(requestedAt) : new Date(),
        rentalDate: new Date(rentalDate),
        rentalStartTime: rentalStartDateTime,
        rentalEndTime: rentalEndDateTime,
        status: status || 'pending',
      },
      include: {
        applicantMember: true,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rentalDate, rentalStartTime, rentalEndTime, status } = req.body;

    const updateData = {};
    if (rentalDate !== undefined) updateData.rentalDate = new Date(rentalDate);
    if (rentalStartTime !== undefined) {
      const date = rentalDate || (await prisma.sameDayRentalRequest.findUnique({ where: { id: parseInt(id) } }))?.rentalDate;
      updateData.rentalStartTime = new Date(`${date}T${rentalStartTime}`);
    }
    if (rentalEndTime !== undefined) {
      const date = rentalDate || (await prisma.sameDayRentalRequest.findUnique({ where: { id: parseInt(id) } }))?.rentalDate;
      updateData.rentalEndTime = new Date(`${date}T${rentalEndTime}`);
    }
    if (status !== undefined) updateData.status = status;

    const request = await prisma.sameDayRentalRequest.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        applicantMember: true,
        rentalSchedule: true,
      },
    });

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.sameDayRentalRequest.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Same day rental request deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const approve = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { renterName, purpose, note } = req.body;

    // 신청 조회
    const request = await prisma.sameDayRentalRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        applicantMember: true,
      },
    });

    if (!request) {
      throw new NotFoundError('Same day rental request not found');
    }

    if (request.status === 'approved') {
      throw new BadRequestError('Request is already approved');
    }

    // rental_schedules에 생성
    const rentalStartDateTime = new Date(`${request.rentalDate.toISOString().split('T')[0]}T${request.rentalStartTime.toTimeString().split(' ')[0]}`);
    const rentalEndDateTime = new Date(`${request.rentalDate.toISOString().split('T')[0]}T${request.rentalEndTime.toTimeString().split(' ')[0]}`);

    const rentalSchedule = await prisma.rentalSchedule.create({
      data: {
        startDatetime: rentalStartDateTime,
        endDatetime: rentalEndDateTime,
        renterType: 'MEMBER',
        renterId: request.applicantMemberId,
        renterName: renterName || request.applicantMember.name,
        purpose,
        note,
        sourceRequestId: request.id,
      },
    });

    // 신청 상태를 approved로 변경
    const updatedRequest = await prisma.sameDayRentalRequest.update({
      where: { id: parseInt(id) },
      data: { status: 'approved' },
      include: {
        applicantMember: true,
        rentalSchedule: true,
      },
    });

    res.status(200).json({
      message: 'Request approved and rental schedule created',
      request: updatedRequest,
      rentalSchedule,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteRequest,
  approve,
};

