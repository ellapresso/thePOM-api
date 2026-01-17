# ThePOM API

백엔드 REST API 서버

## 기술 스택

- Node.js
- Express
- Prisma (MySQL)
- JWT + Session 인증
- Pino (로깅)
- Swagger (API 문서화)

## 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Database
# AWS RDS 또는 로컬 MySQL
DATABASE_URL="mysql://user:password@host:3306/database?connection_limit=10"

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Session
SESSION_SECRET=your-session-secret-key-here

# CORS
# Vercel 프론트엔드 도메인 추가
CORS_ORIGIN=https://your-app.vercel.app

# Logging
LOG_LEVEL=info
```

자세한 환경 변수 설정은 `ENV-TEMPLATE.md`를 참고하세요.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션 (초기 설정 시)
npm run prisma:migrate

# 개발 서버 실행
npm run dev

# 프로덕션 서버 실행
npm start

# 초기 관리자 계정 생성
npm run create-admin

# 세션 정리 (cron job용)
npm run session-cleanup
```

## 배포

Railway에 배포하는 방법은 `RAILWAY-DEPLOYMENT.md`를 참고하세요.

## API 엔드포인트

모든 API는 `/api/v1` 경로로 시작합니다.

### 공개 API (인증 불필요)
- `GET /api/v1/members` - 단원 목록 조회
- `GET /api/v1/members/:id` - 단원 상세 조회
- `GET /api/v1/member-levels` - 단원 레벨 목록
- `GET /api/v1/roles` - 역할 목록
- `GET /api/v1/performances` - 공연 목록
- `GET /api/v1/performance-sessions` - 공연 회차 목록
- `GET /api/v1/performance-members` - 공연 참여 목록
- `GET /api/v1/rental-schedules` - 대관 스케줄 목록

### 관리자 API (인증 필요)
- `POST /api/v1/admin/login` - 관리자 로그인
- `POST /api/v1/admin/logout` - 관리자 로그아웃
- `GET /api/v1/admin/me` - 현재 로그인한 관리자 정보
- `GET /api/v1/admin` - 관리자 목록
- `GET /api/v1/admin/:id` - 관리자 상세
- `POST /api/v1/admin` - 관리자 생성
- `PUT /api/v1/admin/:id` - 관리자 수정
- `DELETE /api/v1/admin/:id` - 관리자 삭제 (soft delete)

### 회계 관련 API (관리자 전용)
- `/api/v1/rental-payments` - 대관비 납부
- `/api/v1/membership-fee-policies` - 회비 정책
- `/api/v1/membership-fee-payments` - 회비 납부
- `/api/v1/discount-policies` - 할인 정책
- `/api/v1/rental-payment-discounts` - 대관 할인 로그
- `/api/v1/membership-payment-discounts` - 회비 할인 로그
- `/api/v1/admin-login-logs` - 관리자 로그인 로그

## API 문서 (Swagger)

서버 실행 후 다음 URL에서 Swagger API 문서를 확인할 수 있습니다:

```
http://localhost:3000/api-docs
```

Swagger UI에서 모든 API 엔드포인트를 확인하고 테스트할 수 있습니다.

## 인증

관리자 로그인 시 JWT 토큰과 세션이 함께 사용됩니다. 동시 로그인 방지를 위해 세션 기반 검증이 포함되어 있습니다.

요청 시 헤더에 다음 형식으로 토큰을 포함하세요:
```
Authorization: Bearer <token>
```

Swagger UI에서 "Authorize" 버튼을 클릭하여 토큰을 입력하면 인증이 필요한 API를 테스트할 수 있습니다.

## 프로젝트 구조

```
thepomapi/
├── src/
│   ├── config/          # 설정 파일
│   ├── controllers/     # 컨트롤러
│   ├── errors/          # 커스텀 에러 클래스
│   ├── middleware/      # 미들웨어
│   ├── routes/          # 라우트
│   ├── utils/           # 유틸리티
│   └── index.js         # 서버 진입점
├── prisma/
│   └── schema.prisma    # Prisma 스키마
└── package.json
```

