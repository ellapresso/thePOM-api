#!/usr/bin/env node

/**
 * 세션 정리 Cron Job 스크립트
 * 
 * 이 스크립트는 cron job으로 주기적으로 실행되어 만료된 세션을 정리합니다.
 * 
 * 사용 예시:
 * 1. 직접 실행: node src/scripts/session-cleanup-cron.js
 * 2. Cron 설정 (매시간 실행):
 *    crontab -e
 *    0 * * * * cd /path/to/thepomapi && node src/scripts/session-cleanup-cron.js >> /var/log/session-cleanup.log 2>&1
 */

require('dotenv').config();
const sessionCleanup = require('../utils/sessionCleanup');
const logger = require('../utils/logger');

(async () => {
  try {
    logger.info('Starting session cleanup job...');
    const deletedCount = await sessionCleanup.cleanupExpiredSessions();
    logger.info(`Session cleanup completed. Deleted ${deletedCount} expired sessions.`);
    process.exit(0);
  } catch (error) {
    logger.error('Session cleanup job failed:', error);
    process.exit(1);
  }
})();

