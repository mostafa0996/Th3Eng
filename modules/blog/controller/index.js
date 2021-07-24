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
const { Blog, Category, Image } = require('../../../common/init/db/init-db');
const {
  handleCategories,
  groupBlogsById,
  formatSearchQuery,
  handleImages,
  formatResult,
} = require('../helpers/utils');
const toLowerCaseArrayValues = require('../../../common/utils/toLowerCaseArrayValues');

const createBlog = async (req, res, next) => {
  try {
    const payload = req.body;
    const requestedCategories = toLowerCaseArrayValues(payload.categories);
    delete payload.categories;
    const createdBlog = await Blog.create(payload);
    await handleImages(payload.images, createdBlog.id);
    const existedCategories = await Category.findAll({
      where: {
        name: {
          [Op.in]: requestedCategories,
        },
      },
      attributes: ['id', 'name'],
    });
    await handleCategories(
      existedCategories,
      requestedCategories,
      createdBlog.id
    );
    createdBlog.dataValues.categories = requestedCategories;
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
    const limit = Number(req.query.limit) || PAGE_LIMIT;
    const page = Number(req.query.page) || 1;
    const offset = limit * page - limit;
    delete req.query.page;

    const { formattedQuery, categoryFormattedQuery } = formatSearchQuery(
      req.query
    );
    const { rows, count } = await Blog.findAndCountAll({
      where: { ...formattedQuery, visibility: true },
      distinct: true,
      include: [
        {
          model: Category,
          where: categoryFormattedQuery,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
        {
          model: Image,
          attributes: ['image'],
        },
      ],
      raw: true,
      nest: true,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    let blogs = formatResult(rows);
    blogs = groupBlogsById(blogs);
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
        visibility: true,
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
        {
          model: Image,
          attributes: ['image'],
        },
      ],
      raw: true,
      nest: true,
    });
    if (!blog.length) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    blog = formatResult(blog);
    blog = groupBlogsById(blog);

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
      const updatePayload = req.body.blogData;
      const requestedCategories = toLowerCaseArrayValues(
        updatePayload.categories
      );
      delete updatePayload.categories;

      const existedCategories = await Category.findAll({
        where: {
          name: {
            [Op.in]: requestedCategories,
          },
        },
        attributes: ['id', 'name'],
      });
      await handleCategories(existedCategories, requestedCategories, id);
      await Blog.update(updatePayload, {
        where: { id },
      });
    }
    result = await Blog.findAll({
      where: {
        id,
        visibility: true,
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
      ],
      raw: true,
      nest: true,
    });
    result = result.map((row) => {
      const _id = row.id;
      delete row.id;
      return {
        _id,
        ...row,
      };
    });
    result = groupBlogsById(result);
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
    const blog = await Blog.findOne({
      where: {
        id,
      },
      attributes: ['id'],
    });
    if (!blog) {
      return next(new ErrorResponse('Blog not exist', NOT_FOUND));
    }
    const result = await Blog.destroy({
      where: { id },
    });
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
