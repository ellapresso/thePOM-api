require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const sessionConfig = require('./config/session');
const errorHandler = require('./middleware/errorHandler');
const ipExtractor = require('./middleware/ipExtractor');
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Trust proxy (for accurate IP addresses behind reverse proxy)
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    // origin이 없으면 (같은 도메인 요청) 허용
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // 프로덕션 환경에서는 허용된 origin만 허용
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true); // 개발 환경에서는 모두 허용
      }
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ipExtractor);
app.use(session(sessionConfig));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ThePOM API Documentation',
}));

// Routes
app.use('/api/v1', require('./routes'));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: 서버 상태 확인
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: 서버가 정상적으로 실행 중입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running
 */
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const dbConnectionTest = require('./utils/dbConnectionTest');

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  
  // DB 연결 테스트 (서버 시작 시)
  setTimeout(async () => {
    try {
      const connectionOk = await dbConnectionTest.testConnection();
      if (connectionOk) {
        await dbConnectionTest.checkPrismaClient();
        await dbConnectionTest.checkAdminSessionTable();
      }
    } catch (err) {
      logger.error('Database connection test failed:', err.message || err);
    }
  }, 2000); // 2초 후 실행
  
  // 주기적 세션 정리는 별도 cron job으로 실행
  // 참고: src/scripts/session-cleanup-cron.js
  logger.info('Session cleanup should be configured as a cron job. See src/scripts/session-cleanup-cron.js');
});

module.exports = app;

