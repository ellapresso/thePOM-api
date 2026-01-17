require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createInitialAdmin() {
  try {
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
      return;
    }

    // 비밀번호 암호화
    const passwordHash = await bcrypt.hash(password, 10);

    // 관리자 생성
    const admin = await prisma.admin.create({
      data: {
        loginId,
        passwordHash,
        name,
        adminType,
      },
    });

    console.log('✅ 초기 관리자 계정이 생성되었습니다.');
    console.log(`   아이디: ${loginId}`);
    console.log(`   비밀번호: ${password}`);
    console.log(`   이름: ${name}`);
    console.log(`   타입: ${adminType}`);
  } catch (error) {
    console.error('❌ 관리자 계정 생성 실패:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialAdmin();

