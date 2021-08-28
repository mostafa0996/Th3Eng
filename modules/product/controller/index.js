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
const { Product, Tag } = require('../../../common/init/db/init-db');
const {
  handleTags,
  formatSearchQuery,
  formatResult,
} = require('../helpers/utils');
const toLowerCaseArrayValues = require('../../../common/utils/toLowerCaseArrayValues');

const createProduct = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.screenshots = payload.screenshots.join();
    const requestedTags = toLowerCaseArrayValues(payload.tags);
    const existedTags = await Tag.findAll({
      where: {},
      attributes: ['name'],
      raw: true,
    });
    payload.tags = await handleTags(existedTags, requestedTags);
    const createdProduct = await Product.create(payload);
    let result = await Product.findAll({
      where: {
        id: createdProduct.id,
      },
      raw: true,
    });
    result = formatResult(result);
    return res.status(CREATED).json({
      success: true,
      message: 'Product created successfully',
      data: result[0],
    });
  } catch (error) {
    logger.error('Error create product: ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || PAGE_LIMIT;
    const page = Number(req.query.page) || 1;
    const offset = limit * page - limit;
    delete req.query.page;

    const { formattedQuery } = formatSearchQuery(req.query, req.user);
    const { rows, count } = await Product.findAndCountAll({
      where: formattedQuery,
      raw: true,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    const products = formatResult(rows);
    return res.status(OK).json({
      success: true,
      message: 'Products loaded successfully',
      count,
      totalPages: Math.ceil(count / limit),
      limit,
      data: products,
    });
  } catch (error) {
    logger.error('Error retrieve products ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const getProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    let product = await Product.findAll({
      where: {
        id,
      },
      raw: true,
    });
    if (!product.length) {
      return next(new ErrorResponse('Product not exist', NOT_FOUND));
    }
    product = formatResult(product);

    const tags = product[0].tags;
    if (tags && tags.length > 0) {
      product[0].relatedProducts = await Product.findAll({
        where: {
          id: {
            [Op.ne]: id,
          },
        },
        raw: true,
      });
    }

    product[0].relatedProducts = formatResult(product[0].relatedProducts);
    return res.status(OK).json({
      success: true,
      message: 'Product loaded successfully',
      data: product[0],
    });
  } catch (error) {
    logger.error('Error get product ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  let result;
  try {
    const product = await Product.findOne({
      where: {
        id,
      },
      attributes: ['id'],
    });
    if (!product) {
      return next(new ErrorResponse('Product not exist', NOT_FOUND));
    }
    if ('visibility' in req.body) {
      const updatedPayload = { visibility: req.body.visibility };
      await Product.update(updatedPayload, { where: { id } });
    } else {
      const updatedPayload = req.body.productData;
      const requestedTags = toLowerCaseArrayValues(updatedPayload.tags);

      const existedTags = await Tag.findAll({
        where: {},
        attributes: ['name'],
        raw: true,
      });
      updatedPayload.tags = await handleTags(existedTags, requestedTags);
      updatedPayload.screenshots = updatedPayload.screenshots.join();
      await Product.update(updatedPayload, {
        where: { id },
      });
    }
    result = await Product.findAll({
      where: {
        id,
      },
      raw: true,
    });
    result = formatResult(result);
    return res.status(OK).json({
      success: true,
      message: 'Product updated successfully',
      data: result[0],
    });
  } catch (error) {
    logger.error('Error update product ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({
      where: {
        id,
      },
      attributes: ['id'],
    });
    if (!product) {
      return next(new ErrorResponse('Product not exist', NOT_FOUND));
    }
    await Product.destroy({
      where: { id },
    });
    return res.status(OK).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    logger.error('Error delete product ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
