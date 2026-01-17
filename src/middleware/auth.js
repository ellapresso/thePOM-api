const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { UnauthorizedError, ForbiddenError } = require('../errors');
const logger = require('../utils/logger');

// JWT 토큰 검증 미들웨어
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.session?.token;

        if (!token) {
            throw new UnauthorizedError('No token provided');
        }

        // JWT 토큰 먼저 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // DB에서 세션 확인 (선택적 - 테이블이 없어도 JWT만으로 인증 가능)
        let session = null;
        try {
            session = await prisma.adminSession.findUnique({
                where: { token },
                include: { admin: { include: { member: true } } },
            });
        } catch (error) {
            // 테이블이 아직 생성되지 않았거나 DB 연결 문제 - JWT만으로 인증 진행
            if (error.message?.includes('Table') || error.message?.includes('Unknown table') || error.code === 'P2001') {
                logger.warn('AdminSession table not found, using JWT only');
            } else {
                logger.warn('Session table not available, using JWT only:', error.message);
            }
        }

        // 세션이 있으면 검증
        if (session) {
            // 세션이 만료되었으면 에러
            if (new Date() > session.expiresAt) {
                // 만료된 세션 삭제
                try {
                    await prisma.adminSession.delete({
                        where: { id: session.id },
                    });
                } catch (error) {
                    // 삭제 실패해도 계속 진행
                }
                throw new UnauthorizedError('Session expired');
            }

            // 세션의 adminId와 토큰의 adminId가 일치하는지 확인
            if (session.adminId !== decoded.adminId) {
                throw new UnauthorizedError('Session and token mismatch');
            }

            // 관리자 정보 확인
            const admin = session.admin;
            if (!admin || admin.deletedAt) {
                throw new UnauthorizedError('Admin not found');
            }

            // 마지막 접근 시간 업데이트
            try {
                await prisma.adminSession.update({
                    where: { id: session.id },
                    data: { lastAccessedAt: new Date() },
                });
            } catch (error) {
                // 업데이트 실패해도 계속 진행
            }

            req.admin = admin;
            req.adminId = decoded.adminId;
            return next();
        }

        // 세션이 없으면 JWT만으로 인증 (하위 호환성)
        // 관리자 정보 조회
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.adminId },
            include: { member: true },
        });

        if (!admin || admin.deletedAt) {
            throw new UnauthorizedError('Admin not found');
        }

        req.admin = admin;
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new UnauthorizedError('Invalid or expired token'));
        }
        next(error);
    }
};

// 관리자 권한 확인 미들웨어
const requireAdmin = (req, res, next) => {
    if (!req.admin) {
        return next(new UnauthorizedError('Admin authentication required'));
    }
    next();
};

// 시스템 관리자 권한 확인 미들웨어
const requireSystemAdmin = (req, res, next) => {
    if (!req.admin || req.admin.adminType !== 'SYSTEM') {
        return next(new ForbiddenError('System admin access required'));
    }
    next();
};

module.exports = {
    verifyToken,
    requireAdmin,
    requireSystemAdmin,
};

