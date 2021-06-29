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
const moment = require('moment')
const {
  roles: { ADMIN, CUSTOMER, MODERATOR },
} = require('../../../common/enum/roles');
const logger = require('../../../common/config/logger');
const config = require('../../../common/config/configuration');
const EmailService = require('../../../common/services/emailService');
const { PAGE_LIMIT } = require('../../../common/constants');
const User = require('../model/index');
const ErrorResponse = require('../../../common/utils/errorResponse');
const { formatSearchOptions } = require('../helpers/utils');
const { exportUsersService } = require('../services/index');
// auth controllers
const socialCallback = require('./socialCallback');
const socialLogin = require('./socialLogin');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorResponse(
          'Login failed, No account with this e-mail',
          NOT_FOUND
        )
      );
    };
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
      success: true,
      message: 'User logged in successfully',
      data: { user, token: data.token },
    });
  } catch (error) {
    console.error(error)
    logger.error('Error while login ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, country, role } =
      req.body;
    const payload = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      phoneNumber,
      email,
      password,
      country,
    };
    role ? (payload.role = role) : null;
    // Create User
    const user = await User.create(payload);

    const verificationToken = jwt.sign(
      { _id: user._id, type: 'Verify' },
      config.jwt.key,
      {
        algorithm: 'HS256',
      }
    );
    const verificationTokenExpiration = Date.now() + Math.abs(3600000 * 4);
    const updatePayload = {
      verificationToken,
      verificationTokenExpiration,
    };
    await User.updateById(user._id, updatePayload);
    EmailService.sendVerificationEmail(
      verificationToken,
      payload.firstName,
      payload.email
    );

    return res
      .status(CREATED)
      .json({ success: true, message: 'User Created', data: user });
  } catch (error) {
    logger.error('Error while signup ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { token } = req.body;
    const selector = {
      verificationToken: token,
      verificationTokenExpiration: { $gt: new Date() },
    };
    const user = await User.findOne(selector);
    if (!user) {
      throw new Error('No valid token found');
    }
    const updatePayload = {
      verified: true,
      verificationToken: null,
      verificationTokenExpiration: null,
    };
    await User.updateById(user._id, updatePayload);
    return res.status(OK).json({
      success: true,
      message: 'User Verified successfully',
      data: null,
    });
  } catch (error) {
    logger.error('Error while verifing user ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.getUserByQuery({ email });
    if (!user) {
      throw new Error('Invalid Email Address');
    }
    const resetPasswordToken = jwt.sign(
      { _id: user._id, type: 'Verify' },
      config.jwt.key,
      {
        algorithm: 'HS256',
      }
    );
    const resetPasswordExpiration = Date.now() + Math.abs(3600000 * 4);
    const updatePayload = {
      resetPasswordToken,
      resetPasswordExpiration,
    };
    await User.updateById(user._id, updatePayload);
    EmailService.sendPasswordResetEmail(
      resetPasswordToken,
      user.firstName,
      user.email
    );
    return res.status(CREATED).json({
      success: true,
      message: 'Password reset token sent successfully',
      data: null,
    });
  } catch (error) {
    logger.error('Error creating reset password token ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const salt = await bcrypt.genSalt(+config.salt);
    const selector = {
      resetPasswordToken: token,
      resetPasswordExpiration: { $gt: new Date() },
    };
    const user = await User.findOne(selector);
    if (!user) {
      throw new Error('No valid token found');
    }

    hashedPassword = await bcrypt.hash(password, salt);
    const updatePayload = {
      resetPasswordToken: null,
      resetPasswordExpiration: null,
      password: hashedPassword,
    };
    await User.updateById(user._id, updatePayload);
    return res.status(OK).json({
      success: true,
      message: 'User Password Reset successfully',
      data: null,
    });
  } catch (error) {
    logger.error('Error resetting user password ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = Number(req.query.limit) || PAGE_LIMIT;
    delete req.query.page;
    const options = {
      skip: limit * page - limit,
      limit: limit,
    };
    const query = formatSearchOptions(req.query);
    const count = await User.count(query);
    const users = await User.find(query, options);
    return res.status(OK).json({
      success: true,
      message: 'Users loaded successfully',
      count,
      totalPages: Math.ceil(count/limit),
      data: users,
    });
  } catch (error) {
    logger.error('Error get all users ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const getUser = async (req, res, next) => {
  try {
    const selector = req.param.id;
    const user = await User.find(selector, options);
    if (!user) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    return res.status(OK).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    logger.error('Error get user', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const loggedInUser = req.user._id;
    const payload = req.body;
    const updatePayload = { _id: userId };
    if (userId == loggedInUser) {
      updatePayload.firstName = payload.firstName;
      updatePayload.lastName = payload.lastName;
      updatePayload.phoneNumber = payload.phoneNumber;
      updatePayload.fullName = `${payload.firstName} ${payload.lastName}`;
    } else {
      updatePayload.firstName = payload.firstName;
      updatePayload.lastName = payload.lastName;
      updatePayload.fullName = `${payload.firstName} ${payload.lastName}`;
      updatePayload.phoneNumber = payload.phoneNumber;
      updatePayload.country = payload.country;
      updatePayload.verified = payload.verified;
      updatePayload.role = payload.role;
      updatePayload.vip = payload.vip;
    }
    const user = await User.updateById(userId, updatePayload);
    return res.status(OK).json({
      success: true,
      message: 'Users updated successfully',
      data: user,
    });
  } catch (error) {
    logger.error('Error update user ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.deleteById(userId);
    return res.status(OK).json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (error) {
    logger.error('Error delete user ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const exportUsers = async (req, res, next) => {
  try {
    const result = await exportUsersService();
    const fileName = moment(new Date()).format('DD-MM-YYYY');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `${'attachment; filename=Users_'}${fileName}.xlsx"`
    );
    return res.status(OK).send(result);
  } catch (error) {
    logger.error('Error delete user ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

module.exports = {
  login,
  signUp,
  socialCallback,
  socialLogin,
  verifyUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  exportUsers
};
