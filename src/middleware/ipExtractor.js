// IP 주소 추출 미들웨어
const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

const ipExtractor = (req, res, next) => {
  req.clientIp = getClientIp(req);
  next();
};

module.exports = ipExtractor;

