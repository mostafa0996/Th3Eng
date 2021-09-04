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
const { Op } = require('sequelize');
const logger = require('../../../common/config/logger');
const { PAGE_LIMIT } = require('../../../common/constants');
const ErrorResponse = require('../../../common/utils/errorResponse');
const {
  Blog,
  Category,
  sequelize,
  Image,
} = require('../../../common/init/db/init-db');
const {
  handleCategories,
  formatSearchQuery,
  formatResult,
  handleImages,
  handleGetImagesValue,
} = require('../helpers/utils');
const toLowerCaseArrayValues = require('../../../common/utils/toLowerCaseArrayValues');

const createBlog = async (req, res, next) => {
  try {
    const payload = req.body;
    const requestedCategories = toLowerCaseArrayValues(payload.categories);
    const existedCategories = await Category.findAll({
      where: {},
      attributes: ['name'],
      raw: true,
    });
    payload.categories = await handleCategories(
      existedCategories,
      requestedCategories
    );

    const images = await handleImages(payload.images);
    payload.images = images.map((img) => img.uniqueId).join(',');
    let createdBlog;
    await sequelize.transaction(async (t) => {
      await Image.bulkCreate(images, { transaction: t });
      createdBlog = await Blog.create(payload);
    });

    let result = await Blog.findAll({
      where: {
        id: createdBlog.id,
      },
      raw: true,
    });

    result = await handleGetImagesValue(result);
    result = formatResult(result);

    return res.status(CREATED).json({
      success: true,
      message: 'Blog created successfully',
      data: result[0],
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
    const limit = Number(req.query.limit) || PAGE_LIMIT;
    const page = Number(req.query.page) || 1;
    const offset = limit * page - limit;
    delete req.query.page;

    const { formattedQuery } = formatSearchQuery(req.query, req.user);
    const { rows, count } = await Blog.findAndCountAll({
      where: formattedQuery,
      raw: true,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    let blogs = await handleGetImagesValue(rows);

    blogs = formatResult(blogs);
    return res.status(OK).json({
      success: true,
      message: 'Blogs loaded successfully',
      count,
      totalPages: Math.ceil(count / limit),
      limit,
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
  try {
    let blog = await Blog.findAll({
      where: {
        id,
      },
      raw: true,
    });
    if (!blog.length) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    blog = await handleGetImagesValue(blog);
    blog = formatResult(blog);

    return res.status(OK).json({
      success: true,
      message: 'Blog loaded successfully',
      data: blog[0],
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
  let result;
  try {
    const blog = await Blog.findOne({
      where: {
        id,
      },
      attributes: ['id'],
    });
    if (!blog) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    if ('visibility' in req.body) {
      const updatedPayload = { visibility: req.body.visibility };
      await Blog.update(updatedPayload, { where: { id } });
    } else {
      const updatedPayload = req.body.blogData;
      const requestedCategories = toLowerCaseArrayValues(
        updatedPayload.categories
      );
      const existedCategories = await Category.findAll({
        where: {},
        attributes: ['name'],
        raw: true,
      });
      updatedPayload.categories = await handleCategories(
        existedCategories,
        requestedCategories
      );
      const images = await handleImages(updatedPayload.images);
      updatedPayload.images = images.map((img) => img.uniqueId).join(',');
      await sequelize.transaction(async (t) => {
        await Image.bulkCreate(images, { transaction: t });
        await Blog.update(updatedPayload, {
          where: { id },
        });
      });
    }
    result = await Blog.findAll({
      where: {
        id,
      },
      raw: true,
    });
    result = await handleGetImagesValue(result);
    result = formatResult(result);
    return res.status(OK).json({
      success: true,
      message: 'Blog updated successfully',
      data: result[0],
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
    const blog = await Blog.findOne({
      where: {
        id,
      },
      attributes: ['id'],
    });
    if (!blog) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    await Blog.destroy({
      where: { id },
    });
    return res.status(OK).json({
      success: true,
      message: 'Blog deleted successfully',
      data: blog,
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
