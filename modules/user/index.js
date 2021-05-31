const express = require('express');
const router = express.Router();
const passport = require('passport');

const isAuthorized = require('../../common/middleware/isAuthorized');
const validateRequest = require('../../common/middleware/validateRequest');
const {
  login,
  socialLogin,
  socialCallback,
  signUp,
  forgotPassword,
  resetPassword,
  verifyUser,
  getAllUsers,
} = require('./controller/index');

const {
  loginSchema,
  signUpSchema,
  userVerifySchema,
  userForgotPasswordSchema,
  userPasswordResetSchema,
  getAllUserSchema,
} = require('./joi/index');

const { USER_GET_ALL_USERS } = require('./helpers/constants');

router.post('/login', validateRequest(loginSchema), login);

router.post('/signup', validateRequest(signUpSchema), signUp);

router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['openid', 'profile', 'email'],
  })
);

router.get(
  '/auth/google/callback',
  socialCallback('google', ['openid', 'profile', 'email']),
  socialLogin
);

// Redirect the user to Facebook for authentication
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    session: false,
    scope: ['public_profile', 'email'],
  })
);
// Facebook will redirect the user to this URL after approval.
// If access was granted, the user will be logged in. Otherwise authentication has failed.
router.get(
  '/auth/facebook/callback',
  socialCallback('facebook', ['public_profile', 'email']),
  socialLogin
);

router.put('/verify', validateRequest(userVerifySchema), verifyUser);

router.post(
  '/forgot-password',
  validateRequest(userForgotPasswordSchema),
  forgotPassword
);

router.post(
  '/reset-password/:token',
  validateRequest(userPasswordResetSchema),
  resetPassword
);

router.get(
  '/',
  isAuthorized(USER_GET_ALL_USERS),
  validateRequest(getAllUserSchema),
  getAllUsers
);

module.exports = router;
