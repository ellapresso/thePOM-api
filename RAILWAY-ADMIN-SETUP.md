# Railway 초기 관리자 계정 생성 가이드

## 비밀번호 암호화 방식

현재 시스템은 **bcrypt**를 사용하여 비밀번호를 암호화합니다.

### 암호화 과정

1. **비밀번호 해시 생성**:
   ```javascript
   const passwordHash = await bcrypt.hash(password, 10);
   ```
   - `bcrypt.hash(비밀번호, saltRounds)`
   - `saltRounds = 10`: 해시 생성 시 사용하는 라운드 수 (높을수록 보안 강화, 처리 시간 증가)
   - 결과: `$2b$10$...` 형식의 해시 문자열

2. **비밀번호 검증** (로그인 시):
   ```javascript
   const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
   ```
   - 평문 비밀번호와 저장된 해시를 비교
   - bcrypt가 자동으로 salt를 추출하여 검증

### 보안 특징

- **단방향 해시**: 원본 비밀번호로 복원 불가능
- **Salt 자동 생성**: 각 비밀번호마다 고유한 salt 사용
- **안전한 검증**: 타이밍 공격 방지

### 예시

**원본 비밀번호**: `1234`

**암호화된 해시** (예시):
```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

이 해시는:
- `$2b$`: bcrypt 버전
- `10$`: salt rounds
- 나머지: salt + 해시 값

## Railway에서 초기 관리자 생성

**중요**: 로컬에서 실행하면 Railway 내부 네트워크 주소(`mysql.railway.internal`)에 접근할 수 없어 실패합니다. 반드시 Railway에서 실행해야 합니다.

### 방법 1: Railway CLI 사용 (권장)

```bash
# Railway CLI 설치 및 로그인
npm install -g @railway/cli
railway login
railway link

# 초기 관리자 계정 생성 (Railway 환경에서 실행)
railway run npm run create-admin
```

**주의**: `railway run` 명령은 Railway 서버 환경에서 실행되므로, Railway의 데이터베이스에 접근할 수 있습니다.

### 방법 2: Railway Shell 사용 (대시보드)

1. Railway 대시보드 접속
2. API 서비스 선택
3. "Settings" 탭 클릭
4. "Shell" 섹션에서 "Open Shell" 버튼 클릭
5. 터미널이 열리면 다음 명령어 실행:

```bash
cd /app
npm run create-admin
```

또는 더 상세한 로그가 필요한 경우:
```bash
cd /app
node src/scripts/create-admin-railway.js
```

**참고**: Railway Shell은 실제 서버 환경에 접속하므로, Railway의 데이터베이스에 직접 접근할 수 있습니다.

## 로컬에서 실행 시 주의사항

**로컬에서 `npm run create-admin`을 실행하면 실패합니다!**

에러 예시:
```
Can't reach database server at `mysql.railway.internal:3306`
```

**이유**: Railway의 `DATABASE_URL`이 내부 네트워크 주소(`mysql.railway.internal`)를 사용하기 때문입니다.

**해결 방법**:
1. Railway CLI 사용: `railway run npm run create-admin` (권장)
2. Railway Shell 사용: 대시보드 → Settings → Open Shell → `npm run create-admin`
3. 로컬에서 테스트하려면 로컬 MySQL의 `DATABASE_URL`을 사용

## 초기 관리자 정보

스크립트가 생성하는 기본 관리자:

- **아이디**: `admin`
- **비밀번호**: `1234` (평문, 스크립트에서 암호화됨)
- **이름**: `시스템 관리자`
- **타입**: `SYSTEM`

**중요**: 프로덕션 환경에서는 배포 후 즉시 비밀번호를 변경하세요!

## 비밀번호 변경 방법

### 방법 1: 관리자 페이지에서 변경

1. `admin` 계정으로 로그인
2. 관리자 설정 페이지에서 비밀번호 변경

### 방법 2: API를 통해 변경

```bash
# Railway CLI 사용
railway run node -e "
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const newPassword = '새비밀번호';
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.admin.update({
    where: { loginId: 'admin' },
    data: { passwordHash }
  });
  console.log('비밀번호 변경 완료');
  await prisma.\$disconnect();
})();
"
```

## 보안 권장사항

1. **초기 비밀번호 변경**: 배포 후 즉시 변경
2. **강력한 비밀번호 사용**: 최소 12자 이상, 대소문자/숫자/특수문자 조합
3. **정기적인 비밀번호 변경**: 3-6개월마다 변경 권장
4. **bcrypt salt rounds**: 현재 10 사용 중 (충분히 안전)

## 비밀번호 암호화 확인

현재 설정된 비밀번호 해시를 확인하려면:

```bash
# Railway CLI 사용
railway run node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const admin = await prisma.admin.findUnique({
    where: { loginId: 'admin' },
    select: { loginId: true, passwordHash: true }
  });
  if (admin) {
    console.log('아이디:', admin.loginId);
    console.log('해시:', admin.passwordHash);
    console.log('해시 길이:', admin.passwordHash.length);
  }
  await prisma.\$disconnect();
})();
"
```

## 문제 해결

### 관리자 계정이 이미 존재하는 경우

스크립트를 실행하면 다음 메시지가 표시됩니다:
```
✅ 관리자 계정이 이미 존재합니다.
   아이디: admin
```

이 경우:
- 기존 계정을 사용하거나
- 관리자 페이지에서 비밀번호를 변경하거나
- 데이터베이스에서 직접 삭제 후 재생성

### 비밀번호를 잊어버린 경우

1. Railway에서 데이터베이스에 직접 접속
2. `admins` 테이블에서 `admin` 계정의 `password_hash` 확인
3. 새로운 해시 생성 후 업데이트 (위의 "비밀번호 변경 방법" 참고)

