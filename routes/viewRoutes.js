const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get(
  '/',
  // bookingController.createBookingCheckOut,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/my-tours',
  // bookingController.createBookingCheckOut,
  authController.protect,
  viewsController.getMyTours
);

router.post('/submit-user-data', viewsController.updateUserData);

module.exports = router;
