#!/usr/bin/env node

/**
 * Railway에서 초기 관리자 계정 생성 스크립트
 * 
 * 이 스크립트는 Railway 환경에서만 실행되어야 합니다.
 * 로컬에서 실행하면 Railway 내부 네트워크 주소에 접근할 수 없어 실패합니다.
 * 
 * 사용법 (Railway에서):
 *   railway run node src/scripts/create-admin-railway.js
 *   또는
 *   Railway 대시보드 → Run Command: node src/scripts/create-admin-railway.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createInitialAdmin() {
  try {
    // DATABASE_URL 확인
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL이 설정되지 않았습니다.');
      console.error('   Railway 대시보드 → Variables 탭에서 DATABASE_URL을 확인하세요.');
      process.exit(1);
    }

    console.log('🔍 Railway 환경에서 초기 관리자 계정 생성 중...\n');

    const loginId = 'admin';
    const password = '1234';
    const name = '시스템 관리자';
    const adminType = 'SYSTEM';

    // 기존 관리자 확인
    const existingAdmin = await prisma.admin.findUnique({
      where: { loginId },
    });

    if (existingAdmin) {
      console.log('✅ 관리자 계정이 이미 존재합니다.');
      console.log(`   아이디: ${loginId}`);
      console.log(`   이름: ${existingAdmin.name}`);
      console.log(`   타입: ${existingAdmin.adminType}`);
      console.log('\n   💡 비밀번호를 변경하려면 관리자 페이지에서 변경하세요.');
      return;
    }

    // 비밀번호 암호화
    console.log('🔐 비밀번호 암호화 중...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('   ✅ 암호화 완료\n');

    // 관리자 생성
    console.log('👤 관리자 계정 생성 중...');
    const admin = await prisma.admin.create({
      data: {
        loginId,
        passwordHash,
        name,
        adminType,
      },
    });

    console.log('\n✅ 초기 관리자 계정이 생성되었습니다!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   아이디: ${loginId}`);
    console.log(`   비밀번호: ${password}`);
    console.log(`   이름: ${name}`);
    console.log(`   타입: ${adminType}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  보안 주의사항:');
    console.log('   - 프로덕션 환경에서는 즉시 비밀번호를 변경하세요!');
    console.log('   - 강력한 비밀번호를 사용하세요 (최소 12자 이상)');
    console.log('   - 관리자 페이지에서 비밀번호를 변경할 수 있습니다.');
  } catch (error) {
    console.error('\n❌ 관리자 계정 생성 실패:', error.message);
    
    if (error.message?.includes('Can\'t reach database server')) {
      console.error('\n💡 해결 방법:');
      console.error('   - Railway 환경에서 실행하고 있는지 확인하세요');
      console.error('   - Railway CLI 사용: railway run npm run create-admin');
      console.error('   - 또는 Railway 대시보드 → Run Command 사용');
      console.error('   - DATABASE_URL 환경 변수가 올바르게 설정되었는지 확인하세요');
    } else if (error.message?.includes('DATABASE_URL')) {
      console.error('\n💡 해결 방법:');
      console.error('   - Railway 대시보드 → Variables 탭에서 DATABASE_URL 확인');
      console.error('   - DATABASE_URL=${{MySQL.MYSQL_URL}} 형식으로 설정');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialAdmin();

