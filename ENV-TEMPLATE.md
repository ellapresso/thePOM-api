# 환경 변수 설정 가이드

`.env` 파일을 생성하고 아래 내용을 참고하여 설정하세요.

## .env 파일 예시

```env
# Database Configuration
# Railway MySQL (자동 생성된 변수 사용)
# DATABASE_URL=${{MySQL.MYSQL_URL}}
# 또는 수동 설정:
# DATABASE_URL="mysql://username:password@host:3306/database_name?connection_limit=10"
# 로컬 MySQL 사용 시
DATABASE_URL="mysql://thepom_user:your_password@localhost:3306/thepom?connection_limit=10"

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production-min-32-characters
JWT_EXPIRES_IN=24h

# Session Configuration
SESSION_SECRET=your-session-secret-change-this-in-production-min-32-characters

# CORS Configuration
# Vercel 프론트엔드 도메인을 추가하세요
# 여러 도메인은 쉼표로 구분
# 예: CORS_ORIGIN=https://your-app.vercel.app,https://www.yourdomain.com
CORS_ORIGIN=https://your-app.vercel.app

# Logging
LOG_LEVEL=info
```

## 중요 사항

1. **보안**: `.env` 파일은 절대 Git에 커밋하지 마세요. `.gitignore`에 포함되어 있습니다.
2. **비밀번호**: 프로덕션 환경에서는 반드시 강력한 비밀번호를 사용하세요.
3. **JWT_SECRET**: 최소 32자 이상의 랜덤 문자열을 사용하세요.
4. **CORS_ORIGIN**: Vercel 프론트엔드 도메인을 정확히 입력하세요.

## DATABASE_URL 형식

### 로컬 MySQL
```
mysql://username:password@localhost:3306/database_name
```

### Railway MySQL
```
# Railway가 자동으로 제공하는 변수 사용
DATABASE_URL=${{MySQL.MYSQL_URL}}

# 또는 수동 설정
mysql://username:password@host.railway.internal:3306/database_name?connection_limit=10
```

### 연결 풀 옵션
- `connection_limit=10`: 최대 연결 수 제한
- `pool_timeout=20`: 연결 풀 타임아웃 (초)

## Railway 환경 변수 설정

Railway 대시보드에서 환경 변수를 설정할 때:

1. **Railway 변수 참조**: `${{MySQL.MYSQL_URL}}` 형식 사용
2. **수동 입력**: 직접 연결 문자열 입력
3. **환경별 설정**: 프로덕션/스테이징 환경 분리 가능

