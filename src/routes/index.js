const express = require('express');
const router = express.Router();

// Public routes
router.use('/members', require('./members'));
router.use('/member-levels', require('./memberLevels'));
router.use('/roles', require('./roles'));
router.use('/performances', require('./performances'));
router.use('/performance-sessions', require('./performanceSessions'));
router.use('/performance-members', require('./performanceMembers'));
router.use('/rental-schedules', require('./rentalSchedules'));

// Admin routes (require authentication)
router.use('/admin', require('./admin'));
router.use('/rental-payments', require('./rentalPayments'));
router.use('/membership-fee-policies', require('./membershipFeePolicies'));
router.use('/membership-fee-payments', require('./membershipFeePayments'));
router.use('/discount-policies', require('./discountPolicies'));
router.use('/rental-payment-discounts', require('./rentalPaymentDiscounts'));
router.use('/membership-payment-discounts', require('./membershipPaymentDiscounts'));
router.use('/admin-login-logs', require('./adminLoginLogs'));
router.use('/regular-meeting-schedules', require('./regularMeetingSchedules'));
router.use('/regular-meeting-attendances', require('./regularMeetingAttendances'));
router.use('/same-day-rental-requests', require('./sameDayRentalRequests'));

module.exports = router;

