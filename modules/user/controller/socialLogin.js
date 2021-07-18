/* eslint-disable no-unused-vars */
const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const ErrorResponse = require('../../../common/utils/errorResponse');

const User = require('../model/index');

// @desc      User social login
// @access    Public
module.exports = async (req, res, next) => {
  // Create User
  try {
    const user = await User.findById(req.user._id);
    const data = user.toAuthJSON();

    return res.status(OK).json({
      success: true,
      message: 'User logged in successfully',
      data,
    });
  } catch (error) {
    console.log(error);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};
