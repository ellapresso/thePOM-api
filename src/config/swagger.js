const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ThePOM API',
      version: '1.0.0',
      description: 'ThePOM 백엔드 REST API 문서',
      contact: {
        name: 'ThePOM API Support',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Member: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            birthDate: { type: 'string', format: 'date-time' },
            phone: { type: 'string', nullable: true },
            memberLevelId: { type: 'integer' },
            profileVisible: { type: 'boolean' },
            firstJoinedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        MemberLevel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            code: { type: 'string', enum: ['ACTOR', 'STAFF', 'MANAGEMENT'] },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
          },
        },
        Performance: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        PerformanceSession: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            performanceId: { type: 'integer' },
            sessionDatetime: { type: 'string', format: 'date-time' },
            note: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        PerformanceMember: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            performanceSessionId: { type: 'integer' },
            memberId: { type: 'integer' },
            roleId: { type: 'integer' },
            characterName: { type: 'string', nullable: true },
          },
        },
        RentalSchedule: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            startDatetime: { type: 'string', format: 'date-time' },
            endDatetime: { type: 'string', format: 'date-time' },
            renterType: { type: 'string', enum: ['MEMBER', 'EXTERNAL'] },
            renterId: { type: 'integer', nullable: true },
            renterName: { type: 'string' },
            purpose: { type: 'string', nullable: true },
            note: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RentalPayment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            rentalScheduleId: { type: 'integer' },
            originalAmount: { type: 'number', format: 'decimal' },
            paidAmount: { type: 'number', format: 'decimal' },
            paymentMethod: { type: 'string', nullable: true },
            paidAt: { type: 'string', format: 'date-time', nullable: true },
            note: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        MembershipFeePolicy: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            memberLevelId: { type: 'integer' },
            baseAmount: { type: 'number', format: 'decimal' },
            description: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        MembershipFeePayment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            memberId: { type: 'integer' },
            memberLevelId: { type: 'integer' },
            targetYear: { type: 'integer' },
            targetMonth: { type: 'integer' },
            originalAmount: { type: 'number', format: 'decimal' },
            paidAmount: { type: 'number', format: 'decimal' },
            paymentStatus: { type: 'string', enum: ['UNPAID', 'PARTIAL', 'PAID'] },
            paymentMethod: { type: 'string', nullable: true },
            paidAt: { type: 'string', format: 'date-time', nullable: true },
            note: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        DiscountPolicy: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            discountType: { type: 'string', enum: ['RATE', 'FIXED'] },
            discountValue: { type: 'number', format: 'decimal' },
            description: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Admin: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            loginId: { type: 'string' },
            name: { type: 'string' },
            adminType: { type: 'string', enum: ['SYSTEM', 'NORMAL'] },
            memberId: { type: 'integer', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        RegularMeetingSchedule: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            meetingName: { type: 'string' },
            meetingDate: { type: 'string', format: 'date' },
            startTime: { type: 'string', format: 'time' },
            endTime: { type: 'string', format: 'time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegularMeetingAttendance: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            regularMeetingScheduleId: { type: 'integer' },
            memberId: { type: 'integer' },
            attendanceStatus: { type: 'string', enum: ['attended', 'absent', 'late'] },
            memo: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        SameDayRentalRequest: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            applicantMemberId: { type: 'integer' },
            requestedAt: { type: 'string', format: 'date-time' },
            rentalDate: { type: 'string', format: 'date' },
            rentalStartTime: { type: 'string', format: 'time' },
            rentalEndTime: { type: 'string', format: 'time' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

