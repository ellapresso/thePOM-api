// 유효성 검사 유틸리티 함수들

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  // 한국 전화번호 형식 (010-1234-5678 등)
  const re = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return re.test(phone);
};

const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const validateEnum = (value, allowedValues) => {
  return allowedValues.includes(value);
};

const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str.trim();
};

module.exports = {
  validateEmail,
  validatePhone,
  validateDate,
  validateEnum,
  sanitizeString,
};

