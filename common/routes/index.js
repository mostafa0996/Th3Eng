const express = require('express');
const router = express.Router();
const { Tag, Category } = require('../init/db/init-db');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../config/logger');
const { INTERNAL_SERVER_ERROR, OK } = require('http-status-codes');

router.get('/tags', async (req, res, next) => {
  try {
    const tags = await Tag.findAll({});
    return res.status(OK).json({
      success: true,
      message: 'Tags loaded successfully',
      data: tags,
    });
  } catch (error) {
    logger.error('Error get all tags ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.findAll({});
    return res.status(OK).json({
      success: true,
      message: 'Categories loaded successfully',
      data: categories,
    });
  } catch (error) {
    logger.error('Error get all categories ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
});

module.exports = router;
