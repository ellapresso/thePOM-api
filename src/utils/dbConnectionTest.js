const prisma = require('../config/database');
const logger = require('./logger');

/**
 * 데이터베이스 연결 테스트
 * 서버 시작 시 또는 필요할 때 호출하여 DB 연결 상태를 확인
 */
const testConnection = async () => {
  try {
    // 간단한 쿼리로 연결 테스트
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    return false;
  }
};

/**
 * AdminSession 테이블 존재 여부 확인
 */
const checkAdminSessionTable = async () => {
  try {
    // 테이블 존재 여부 확인
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'admin_sessions'
    `;
    
    const tableExists = result[0]?.count > 0;
    
    if (tableExists) {
      logger.info('AdminSession table exists');
    } else {
      logger.warn('AdminSession table does not exist');
    }
    
    return tableExists;
  } catch (error) {
    logger.warn('Could not check AdminSession table:', error.message);
    return false;
  }
};

/**
 * Prisma Client 상태 확인
 */
const checkPrismaClient = () => {
  try {
    const hasAdminSession = !!prisma.adminSession;
    logger.info(`Prisma Client AdminSession model available: ${hasAdminSession}`);
    return hasAdminSession;
  } catch (error) {
    logger.error('Prisma Client check failed:', error.message);
    return false;
  }
};

module.exports = {
  testConnection,
  checkAdminSessionTable,
  checkPrismaClient,
};

