const {
  OK,
  CREATED,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  NO_CONTENT,
  NOT_FOUND,
} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  roles: { ADMIN, CUSTOMER, MODERATOR },
} = require('../../../common/enum/roles');
const logger = require('../../../common/config/logger');
const config = require('../../../common/config/configuration');
const EmailService = require('../../../common/services/emailService');
const { PAGE_LIMIT } = require('../../../common/constants');
const userModel = require('../model/index');
const ErrorResponse = require('../../../common/utils/errorResponse');

// auth controllers
const socialCallback = require('./socialCallback');
const socialLogin = require('./socialLogin');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(
        new ErrorResponse(
          'Login failed, No account with this e-mail',
          NOT_FOUND
        )
      );
    }
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return next(
        new ErrorResponse(
          'Login Failed, please make sure password is correct!',
          UNAUTHORIZED
        )
      );
    }
    const data = user.toAuthJSON();
    return res.status(OK).json({
      status: true,
      message: 'User logged in successfully',
      data: { user, token: data.token },
    });
  } catch (error) {
    logger.error('Error while login ', error.messgae);
    next(new ErrorResponse(err.message, err.status || INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  login,
  socialCallback,
  socialLogin,
};
