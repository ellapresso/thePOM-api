const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { UnauthorizedError, NotFoundError, BadRequestError, ConflictError } = require('../errors');
const logger = require('../utils/logger');

const login = async (req, res, next) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      throw new BadRequestError('Login ID and password are required');
    }

    const admin = await prisma.admin.findUnique({
      where: { loginId },
      include: { member: true },
    });

    if (!admin || admin.deletedAt) {
      // 로그인 실패 로그 기록
      await prisma.adminLoginLog.create({
        data: {
          adminId: 0, // 존재하지 않는 관리자
          success: false,
          ipAddress: req.clientIp || req.ip,
          userAgent: req.get('user-agent'),
        },
      });
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      // 로그인 실패 로그 기록
      await prisma.adminLoginLog.create({
        data: {
          adminId: admin.id,
          success: false,
          ipAddress: req.clientIp || req.ip,
          userAgent: req.get('user-agent'),
        },
      });
      throw new UnauthorizedError('Invalid credentials');
    }

    // JWT 토큰 생성
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { adminId: admin.id, loginId: admin.loginId },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // JWT 만료 시간 계산 (초 단위를 밀리초로 변환)
    const expiresInSeconds = expiresIn.includes('h')
      ? parseInt(expiresIn) * 60 * 60
      : expiresIn.includes('d')
        ? parseInt(expiresIn) * 24 * 60 * 60
        : parseInt(expiresIn);
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // 기존 세션 모두 무효화 (동시 로그인 방지)
    try {
      await prisma.adminSession.deleteMany({
        where: { adminId: admin.id },
      });
    } catch (error) {
      // 테이블이 아직 생성되지 않았거나 DB 연결 문제
      if (error.message?.includes('Table') || error.message?.includes('Unknown table') || error.code === 'P2001') {
        logger.warn('AdminSession table not found, session management disabled');
      } else {
        logger.warn('Failed to delete existing sessions:', error.message);
      }
    }

    // DB에 세션 저장
    try {
      await prisma.adminSession.create({
        data: {
          adminId: admin.id,
          token,
          ipAddress: req.clientIp || req.ip,
          userAgent: req.get('user-agent'),
          expiresAt,
        },
      });
    } catch (error) {
      // 테이블이 아직 생성되지 않았거나 DB 연결 문제
      if (error.message?.includes('Table') || error.message?.includes('Unknown table') || error.code === 'P2001') {
        logger.warn('AdminSession table not found, session management disabled');
      } else {
        logger.warn('Failed to create session in DB:', error.message);
      }
      // 세션 저장 실패해도 로그인은 계속 진행 (하위 호환성)
    }

    // Express 세션에도 저장 (하위 호환성)
    req.session.adminId = admin.id;
    req.session.token = token;
    req.session.loginId = admin.loginId;

    // 로그인 성공 로그 기록
    await prisma.adminLoginLog.create({
      data: {
        adminId: admin.id,
        success: true,
        ipAddress: req.clientIp || req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.status(200).json({
      token,
      admin: {
        id: admin.id,
        loginId: admin.loginId,
        name: admin.name,
        adminType: admin.adminType,
        member: admin.member,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.session?.token;

    // DB에서 세션 삭제
    if (token) {
      await prisma.adminSession.deleteMany({
        where: { token },
      });
    }

    // Express 세션 삭제
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.adminId },
      include: { member: true },
    });

    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    res.status(200).json({
      id: admin.id,
      loginId: admin.loginId,
      name: admin.name,
      adminType: admin.adminType,
      member: admin.member,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const admins = await prisma.admin.findMany({
      where: { deletedAt: null },
      include: { member: true },
    });
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
      include: {
        member: {
          include: {
            memberLevel: true,
          },
        },
      },
    });

    if (!admin || admin.deletedAt) {
      throw new NotFoundError('Admin not found');
    }

    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { loginId, password, name, memberId } = req.body;

    if (!loginId || !password || !name) {
      throw new BadRequestError('Login ID, password, and name are required');
    }

    // 중복 확인
    const existingAdmin = await prisma.admin.findUnique({
      where: { loginId },
    });

    if (existingAdmin) {
      throw new ConflictError('Login ID already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 관리자 등록 시 항상 일반 관리자(NORMAL)로만 등록
    const admin = await prisma.admin.create({
      data: {
        loginId,
        passwordHash,
        name,
        adminType: 'NORMAL',
        memberId: memberId ? parseInt(memberId) : null,
      },
      include: { member: true },
    });

    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, adminType, memberId, password } = req.body;

    // 현재 로그인한 관리자 정보 확인
    const currentAdmin = await prisma.admin.findUnique({
      where: { id: req.adminId },
    });

    if (!currentAdmin) {
      throw new UnauthorizedError('Current admin not found');
    }

    // 수정하려는 관리자 정보 확인
    const targetAdmin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
    });

    if (!targetAdmin || targetAdmin.deletedAt) {
      throw new NotFoundError('Admin not found');
    }

    // admin 계정은 시스템 관리자만 수정 가능
    if (targetAdmin.loginId === 'admin' && currentAdmin.adminType !== 'SYSTEM') {
      throw new UnauthorizedError('Only system administrators can modify the admin account');
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (adminType) {
      // admin 계정의 타입은 변경 불가
      if (targetAdmin.loginId === 'admin' && adminType !== 'SYSTEM') {
        throw new BadRequestError('Cannot change admin account type');
      }
      updateData.adminType = adminType;
    }
    if (memberId !== undefined) updateData.memberId = memberId ? parseInt(memberId) : null;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const admin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { member: true },
    });

    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 현재 로그인한 관리자 정보 확인
    const currentAdmin = await prisma.admin.findUnique({
      where: { id: req.adminId },
    });

    if (!currentAdmin) {
      throw new UnauthorizedError('Current admin not found');
    }

    // 삭제하려는 관리자 정보 확인
    const targetAdmin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
    });

    if (!targetAdmin || targetAdmin.deletedAt) {
      throw new NotFoundError('Admin not found');
    }

    // admin 계정은 시스템 관리자만 삭제 가능
    if (targetAdmin.loginId === 'admin' && currentAdmin.adminType !== 'SYSTEM') {
      throw new UnauthorizedError('Only system administrators can delete the admin account');
    }

    // Soft delete
    const admin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  getAll,
  getById,
  create,
  update,
  delete: deleteAdmin,
};

