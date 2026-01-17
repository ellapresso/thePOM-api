const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

// DATABASE_URL 검증
if (!process.env.DATABASE_URL) {
  logger.error('DATABASE_URL environment variable is not set!');
  throw new Error('DATABASE_URL is required');
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// 연결 풀 설정
// Prisma는 자동으로 연결 풀을 관리하지만, 필요시 connection_limit 옵션 사용 가능
// DATABASE_URL에 ?connection_limit=10 형식으로 추가 가능

module.exports = prisma;

