/* eslint-disable no-unused-vars */
const { OK } = require('http-status-codes');

const User = require('../model/index');

// @desc      User social login
// @access    Public
module.exports = async (req, res, next) => {
  // Create User
  const user = await User.findById(req.user._id);
  const data = user.toAuthJSON();

  return res.status(OK).json({
    status: true,
    message: 'User logged in successfully',
    data
  });
};
