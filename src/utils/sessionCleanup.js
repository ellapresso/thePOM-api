const prisma = require('../config/database');
const logger = require('./logger');

/**
 * 만료된 세션 정리
 * 주기적으로 실행하여 DB에서 만료된 세션을 삭제
 */
const cleanupExpiredSessions = async () => {
  try {
    // Prisma Client가 준비되지 않았을 수 있으므로 확인
    if (!prisma.adminSession) {
      logger.warn('AdminSession model not available yet, skipping cleanup');
      return 0;
    }

    const result = await prisma.adminSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      logger.info(`Cleaned up ${result.count} expired sessions`);
    }

    return result.count;
      } catch (error) {
        // 테이블이 아직 생성되지 않았을 수 있으므로 에러를 무시하지 않고 로그만 남김
        if (error.code === 'P2001' || error.message?.includes('does not exist') || error.message?.includes('Table') || error.message?.includes('Unknown table')) {
          logger.warn('AdminSession table not found, skipping cleanup');
          return 0;
        }
        // Prisma 에러 코드 확인
        if (error.code && error.code.startsWith('P')) {
          logger.warn(`Prisma error (${error.code}), skipping cleanup:`, error.message);
          return 0;
        }
        logger.error('Error cleaning up expired sessions:', error.message || error);
        // 에러를 throw하지 않고 0을 반환하여 서버가 계속 실행되도록 함
        return 0;
      }
};

/**
 * 특정 관리자의 모든 세션 삭제 (강제 로그아웃)
 */
const deleteAllSessionsByAdminId = async (adminId) => {
  try {
    if (!prisma.adminSession) {
      logger.warn('AdminSession model not available');
      return 0;
    }

    const result = await prisma.adminSession.deleteMany({
      where: { adminId },
    });

    logger.info(`Deleted ${result.count} sessions for admin ${adminId}`);
    return result.count;
  } catch (error) {
    logger.error(`Error deleting sessions for admin ${adminId}:`, error);
    throw error;
  }
};

module.exports = {
  cleanupExpiredSessions,
  deleteAllSessionsByAdminId,
};

