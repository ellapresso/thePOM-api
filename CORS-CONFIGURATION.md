# CORS 설정 가이드

## 현재 CORS 설정 상태

### 백엔드 설정 (`thepomapi/src/index.js`)

```javascript
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
```

### 프론트엔드 설정 (`thepomlist/lib/adminApi.ts`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // ...
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // 쿠키 포함
  });
  // ...
};
```

## 설정 요구사항

### 1. Railway (백엔드) 환경 변수

**필수 환경 변수:**
- `CORS_ORIGIN`: Vercel 프론트엔드 도메인 (예: `https://your-app.vercel.app`)
- 여러 도메인 허용 시 쉼표로 구분 (예: `https://app.vercel.app,https://www.yourdomain.com`)

**설정 방법:**
1. Railway 대시보드 접속
2. API 서비스 선택
3. "Variables" 탭 클릭
4. `CORS_ORIGIN` 변수 추가:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```

### 2. Vercel (프론트엔드) 환경 변수

**필수 환경 변수:**
- `NEXT_PUBLIC_API_URL`: Railway API 도메인 (예: `https://your-api.railway.app/api/v1`)

**설정 방법:**
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. "Settings" → "Environment Variables" 클릭
4. `NEXT_PUBLIC_API_URL` 변수 추가:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1
   ```

## CORS 동작 방식

### 개발 환경 (`NODE_ENV !== 'production'`)
- **모든 origin 허용**: 개발 편의성을 위해 모든 요청 허용
- 기본값: `http://localhost:3000`, `http://localhost:3001`

### 프로덕션 환경 (`NODE_ENV === 'production'`)
- **허용된 origin만 허용**: `CORS_ORIGIN`에 명시된 도메인만 허용
- **credentials: true**: 쿠키 및 인증 정보 포함 허용

## Railway 로그에서 CORS 오류 확인

Railway 로그에서 다음과 같은 오류가 보이면 CORS 설정 문제입니다:

```
error="Not allowed by CORS" path="/api/v1/members"
```

**원인:**
- 요청한 origin이 `CORS_ORIGIN` 환경 변수에 설정되지 않음
- 프로덕션 환경에서 허용되지 않은 origin에서 요청

**해결 방법:**
1. Railway 대시보드 → API 서비스 → Variables 탭
2. `CORS_ORIGIN` 확인 및 수정
3. Vercel 프론트엔드 도메인을 정확히 입력 (프로토콜 포함)
4. 서비스 재시작

**디버깅:**
- 서버 시작 시 로그에서 `CORS Configuration` 확인
- 차단된 요청의 origin은 `CORS: Blocked request from origin` 로그에서 확인 가능

## 일반적인 CORS 오류 및 해결 방법

### 오류 1: `Access-Control-Allow-Origin` 헤더 없음

**증상:**
```
Access to fetch at 'https://api.railway.app/api/v1/...' from origin 'https://app.vercel.app' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**원인:**
- `CORS_ORIGIN` 환경 변수가 설정되지 않음
- 프론트엔드 도메인이 `CORS_ORIGIN`에 포함되지 않음

**해결:**
1. Railway에서 `CORS_ORIGIN` 환경 변수 확인
2. Vercel 도메인을 정확히 입력 (프로토콜 포함: `https://`)
3. Railway 서비스 재시작

### 오류 2: `credentials` 관련 오류

**증상:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy: 
The value of the 'Access-Control-Allow-Credentials' header in the response is '' 
which must be 'true' when the request's credentials mode is 'include'.
```

**원인:**
- 프론트엔드에서 `credentials: 'include'` 사용 중
- 백엔드 CORS 설정에 `credentials: true` 필요

**해결:**
- 백엔드 CORS 설정 확인 (이미 `credentials: true`로 설정됨)
- `CORS_ORIGIN`에 와일드카드(`*`) 사용 불가 (credentials 사용 시)

### 오류 3: Preflight 요청 실패

**증상:**
```
Access to fetch at '...' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check
```

**원인:**
- OPTIONS 요청에 대한 응답이 올바르지 않음
- 허용되지 않은 HTTP 메서드 사용

**해결:**
- CORS 미들웨어가 OPTIONS 요청을 올바르게 처리하는지 확인
- 현재 설정은 `cors` 패키지가 자동으로 처리함

## 확인 체크리스트

### Railway (백엔드)
- [ ] `CORS_ORIGIN` 환경 변수 설정됨
- [ ] Vercel 도메인이 정확히 입력됨 (프로토콜 포함)
- [ ] 여러 도메인 사용 시 쉼표로 구분
- [ ] `NODE_ENV=production` 설정됨
- [ ] 서비스 재시작 완료

### Vercel (프론트엔드)
- [ ] `NEXT_PUBLIC_API_URL` 환경 변수 설정됨
- [ ] Railway API 도메인이 정확히 입력됨
- [ ] `/api/v1` 경로 포함됨
- [ ] 빌드 및 배포 완료

### 테스트
- [ ] 브라우저 개발자 도구 → Network 탭에서 CORS 헤더 확인
- [ ] `Access-Control-Allow-Origin` 헤더가 프론트엔드 도메인과 일치하는지 확인
- [ ] `Access-Control-Allow-Credentials: true` 헤더 확인

## 디버깅 방법

### 1. Railway 로그 확인

```bash
# Railway CLI 사용
railway logs

# 또는 대시보드에서 확인
# Railway → API 서비스 → "Deployments" → "View Logs"
```

CORS 오류가 발생하면 로그에 다음과 같은 메시지가 표시됩니다:
```
Error: Not allowed by CORS
```

### 2. 브라우저 개발자 도구 확인

1. 브라우저 개발자 도구 열기 (F12)
2. "Network" 탭 선택
3. API 요청 클릭
4. "Headers" 섹션 확인:
   - **Request Headers**: `Origin` 헤더 확인
   - **Response Headers**: 
     - `Access-Control-Allow-Origin` 확인
     - `Access-Control-Allow-Credentials` 확인

### 3. curl로 테스트

```bash
# Preflight 요청 테스트
curl -X OPTIONS \
  -H "Origin: https://your-app.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v https://your-api.railway.app/api/v1/admin/login

# 실제 요청 테스트
curl -X POST \
  -H "Origin: https://your-app.vercel.app" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -v https://your-api.railway.app/api/v1/admin/me
```

## 주의사항

1. **프로토콜 일치**: `CORS_ORIGIN`에 `https://` 포함 필수
2. **도메인 정확성**: `www` 포함 여부 확인 (예: `www.domain.com` vs `domain.com`)
3. **와일드카드 불가**: `credentials: true` 사용 시 `*` 사용 불가
4. **환경 변수 재시작**: 환경 변수 변경 후 서비스 재시작 필요

## 예시 설정

### Railway 환경 변수
```
CORS_ORIGIN=https://thepom.vercel.app
NODE_ENV=production
DATABASE_URL=${{MySQL.MYSQL_URL}}
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret-here
```

### Vercel 환경 변수
```
NEXT_PUBLIC_API_URL=https://thepom-api.railway.app/api/v1
```

## 추가 리소스

- [MDN CORS 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS 미들웨어](https://expressjs.com/en/resources/middleware/cors.html)
- [Railway 환경 변수 설정](https://docs.railway.app/develop/variables)
- [Vercel 환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)

