const _ = require('lodash');
const {
  OK,
  CREATED,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
} = require('http-status-codes');
const path = require('path');
const {
  roles: { ADMIN, CUSTOMER, MODERATOR },
} = require('../../../common/enum/roles');
const logger = require('../../../common/config/logger');
const { PAGE_LIMIT } = require('../../../common/constants');
const ErrorResponse = require('../../../common/utils/errorResponse');
const Utils = require('../helpers/utils');
const Blog = require('../model/index');
const Category = require('../../../common/schema/Category');

const createBlog = async (req, res, next) => {
  try {
    const payload = req.body;
    const existedCategories = await Category.find({});
    payload.categories = await Utils.handleCategories(
      existedCategories,
      payload.categories
    );
    const createdBlog = await Blog.create(payload);
    return res.status(CREATED).json({
      success: true,
      message: 'Blog created successfully',
      data: createdBlog,
    });
  } catch (error) {
    logger.error('Error create blog: ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const populateCollection = 'categories';
    const limit = Number(req.query.limit) || PAGE_LIMIT;
    const page = Number(req.query.page) || 1;
    const options = {
      skip: (limit * page) - limit,
      limit: limit,
    };
    const searchQuery = Utils.formatSearchQuery(req.query.search);
    const count = await Blog.count(searchQuery);
    const blogs = await Blog.find(searchQuery, options, populateCollection);
    return res.status(OK).json({
      success: true,
      message: 'Blogs loaded successfully',
      count,
      totalPages: Math.ceil(count/limit),
      data: blogs,
    });
  } catch (error) {
    logger.error('Error retrieve blogs ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const getBlog = async (req, res, next) => {
  const { id } = req.params;
  const populateCollection = 'categories';
  try {
    const blog = await Blog.findById(id, {}, populateCollection);
    if (!blog) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    return res.status(OK).json({
      success: true,
      message: 'Blog loaded successfully',
      data: blog,
    });
  } catch (error) {
    logger.error('Error get blog ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const updateBlog = async (req, res, next) => {
  const { id } = req.params;
  const populateCollection = 'categories';
  try {
    const blog = await Blog.findById(id, { _id: 1 }, populateCollection);
    if (!blog) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    const existedCategories = await Category.find({});
    const updatePayload = await Utils.handleCategories(
      existedCategories,
      req.body.categories
    );
    const result = await Blog.updateById(id, updatePayload, populateCollection);
    return res.status(OK).json({
      success: true,
      message: 'Blog updated successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error update blog ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const deleteBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    const result = await Blog.deleteById(id);
    return res.status(OK).json({
      success: true,
      message: 'Blog deleted successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error delete blog ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
};
