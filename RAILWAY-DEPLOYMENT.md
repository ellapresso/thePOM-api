# Railway 배포 가이드

이 가이드는 Railway에 ThePOM API를 배포하는 방법을 설명합니다.

## 아키텍처 개요

- **Railway**: API 서버 + MySQL 데이터베이스
- **Vercel**: 프론트엔드 배포

## 1. Railway 계정 및 프로젝트 생성

### 1.1 Railway 계정 생성

1. [Railway](https://railway.app)에 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭

### 1.2 프로젝트 생성

1. "Deploy from GitHub repo" 선택
2. `thepom` 저장소 선택
3. "thepomapi" 폴더를 루트로 설정

## 2. MySQL 데이터베이스 추가

### 2.1 MySQL 플러그인 추가

1. Railway 프로젝트 대시보드에서 "New" 클릭
2. "Database" → "Add MySQL" 선택
3. 데이터베이스가 자동으로 생성됨

### 2.2 데이터베이스 연결 정보 확인

1. MySQL 서비스 클릭
2. "Variables" 탭에서 다음 정보 확인:
   - `MYSQLDATABASE`: 데이터베이스 이름
   - `MYSQLUSER`: 사용자 이름
   - `MYSQLPASSWORD`: 비밀번호
   - `MYSQLHOST`: 호스트 주소
   - `MYSQLPORT`: 포트 번호 (기본 3306)

## 3. 애플리케이션 배포 설정

### 3.1 서비스 설정

1. API 서비스 클릭
2. "Settings" 탭에서:
   - **Root Directory**: `thepomapi` 설정
   - **Build Command**: `npm install && npm run prisma:generate`
   - **Start Command**: `npm start`

### 3.2 환경 변수 설정

"Variables" 탭에서 다음 환경 변수 추가:

```env
# Database (Railway MySQL 플러그인에서 자동 생성됨)
# Railway가 자동으로 $MYSQL_URL을 제공하므로 DATABASE_URL을 설정:
DATABASE_URL=${{MySQL.MYSQL_URL}}

# 또는 수동으로 설정:
# DATABASE_URL=mysql://${{MySQL.MYSQLUSER}}:${{MySQL.MYSQLPASSWORD}}@${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}

# Server
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-very-secure-secret-key-change-this-min-32-characters
JWT_EXPIRES_IN=24h

# Session Configuration
SESSION_SECRET=your-very-secure-session-secret-change-this-min-32-characters

# CORS Configuration
# Vercel 프론트엔드 도메인 추가
CORS_ORIGIN=https://your-app.vercel.app

# Logging
LOG_LEVEL=info
```

### 3.3 Railway 네트워크 설정

1. "Settings" → "Networking" 탭
2. "Generate Domain" 클릭하여 공개 도메인 생성
3. 또는 커스텀 도메인 연결 가능

## 4. 데이터베이스 마이그레이션

### 4.1 Railway CLI 설치 (선택사항)

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login
```

### 4.2 마이그레이션 실행

방법 1: Railway 대시보드에서 실행

1. API 서비스 → "Deployments" 탭
2. 최신 배포의 "View Logs" 클릭
3. 마이그레이션이 자동으로 실행되는지 확인

방법 2: Railway CLI 사용

```bash
# 프로젝트 연결
railway link

# 마이그레이션 실행
railway run npm run prisma:migrate
# 또는
railway run npx prisma db push
```

방법 3: 배포 후 스크립트 실행

`package.json`에 배포 후 스크립트 추가:

```json
{
  "scripts": {
    "postdeploy": "npx prisma migrate deploy || npx prisma db push"
  }
}
```

### 4.3 초기 관리자 계정 생성

```bash
# Railway CLI 사용
railway run npm run create-admin

# 또는 Railway 대시보드에서 "Run Command" 사용
```

## 5. 세션 정리 Cron Job 설정

Railway는 기본적으로 cron job을 지원하지 않지만, 다음 방법으로 설정 가능:

### 방법 1: Railway Cron Job 플러그인 사용

1. Railway 프로젝트에서 "New" → "Cron Job" 선택
2. 설정:
   - **Schedule**: `0 * * * *` (매시간)
   - **Command**: `cd thepomapi && node src/scripts/session-cleanup-cron.js`
   - **Service**: API 서비스 선택

### 방법 2: 별도 서비스로 실행

1. "New" → "Empty Service" 생성
2. Root Directory: `thepomapi`
3. Start Command: `node src/scripts/session-cleanup-cron.js`
4. Cron Schedule 설정

### 방법 3: API 요청 시 세션 정리 (간단한 방법)

`src/index.js`에서 요청 시마다 만료된 세션 정리 (성능 고려 필요)

## 6. 배포 확인

### 6.1 배포 상태 확인

1. Railway 대시보드에서 배포 상태 확인
2. "Deployments" 탭에서 로그 확인
3. "Metrics" 탭에서 리소스 사용량 확인

### 6.2 API 테스트

```bash
# Health check
curl https://your-app.railway.app/health

# API 문서 확인
curl https://your-app.railway.app/api-docs
```

## 7. Vercel 프론트엔드 설정

### 7.1 환경 변수 설정

Vercel 프로젝트 설정에서:

```env
NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1
```

### 7.2 CORS 설정

Railway API 서비스의 환경 변수에 Vercel 도메인 추가:

```env
CORS_ORIGIN=https://your-app.vercel.app
```

## 8. 모니터링 및 로그

### 8.1 Railway 대시보드

- **Metrics**: CPU, 메모리, 네트워크 사용량
- **Logs**: 실시간 로그 확인
- **Deployments**: 배포 이력

### 8.2 로그 확인

```bash
# Railway CLI로 로그 확인
railway logs

# 특정 서비스 로그만
railway logs --service api
```

## 9. 백업 설정

### 9.1 데이터베이스 백업

Railway MySQL 플러그인은 자동 백업을 제공합니다:

1. MySQL 서비스 → "Data" 탭
2. "Download Backup" 클릭
3. 또는 Railway CLI 사용:

```bash
railway connect mysql
# MySQL 명령어로 백업
mysqldump -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE > backup.sql
```

### 9.2 자동 백업 설정

Railway는 자동 백업을 제공하지만, 추가 백업이 필요하면:

1. 별도 서비스로 백업 스크립트 실행
2. 외부 스토리지(S3 등)에 백업 저장

## 10. 트러블슈팅

### 10.1 배포 실패

```bash
# 로그 확인
railway logs

# 로컬에서 테스트
npm install
npm run prisma:generate
npm start
```

### 10.2 데이터베이스 연결 오류

1. 환경 변수 `DATABASE_URL` 확인
2. MySQL 서비스가 실행 중인지 확인
3. Railway 대시보드에서 MySQL 연결 정보 확인

### 10.3 Prisma Client 오류

```bash
# Railway CLI로 Prisma Client 재생성
railway run npm run prisma:generate

# 또는 배포 시 자동 생성되도록 Build Command 확인
```

### 10.4 포트 오류

Railway는 자동으로 `PORT` 환경 변수를 설정합니다. 코드에서 `process.env.PORT`를 사용하는지 확인하세요.

## 11. 비용 최적화

### 11.1 리소스 제한

- Railway 무료 플랜: 제한된 리소스
- 프로 플랜: 더 많은 리소스 및 기능

### 11.2 최적화 팁

1. 불필요한 로그 제거
2. 데이터베이스 쿼리 최적화
3. 연결 풀 설정 조정

## 12. 보안 체크리스트

- [ ] 강력한 `JWT_SECRET` 및 `SESSION_SECRET` 사용
- [ ] 환경 변수에 민감한 정보 저장 (Git에 커밋하지 않음)
- [ ] CORS 설정에 허용된 도메인만 추가
- [ ] Railway 대시보드 접근 권한 제한
- [ ] 정기적인 보안 업데이트

## 13. CI/CD 자동화

### 13.1 GitHub 연동

Railway는 GitHub과 자동 연동됩니다:

1. 코드 푸시 시 자동 배포
2. Pull Request별 프리뷰 배포 가능
3. 브랜치별 환경 분리 가능

### 13.2 배포 전략

- **Main 브랜치**: 프로덕션 자동 배포
- **Develop 브랜치**: 스테이징 환경
- **Feature 브랜치**: 프리뷰 배포

## 참고 자료

- [Railway 공식 문서](https://docs.railway.app)
- [Railway MySQL 가이드](https://docs.railway.app/databases/mysql)
- [Prisma 공식 문서](https://www.prisma.io/docs)

