const express = require('express');
const router = express.Router();
const passport = require('passport');

const validateRequest = require('../../common/middleware/validateRequest');
const { login, socialLogin, socialCallback } = require('./controller/index');
const { loginSchema } = require('./joi/index');

router.post('/login', validateRequest(loginSchema), login);

router.post('/signup', (req, res) => {
  res.json({
    success: true,
    message: 'Sign up succesfully',
  });
});

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

module.exports = router;
