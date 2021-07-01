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
const {
  roles: { ADMIN, CUSTOMER, MODERATOR },
} = require('../../../common/enum/roles');
const logger = require('../../../common/config/logger');
const config = require('../../../common/config/configuration');
const { PAGE_LIMIT } = require('../../../common/constants');
const ErrorResponse = require('../../../common/utils/errorResponse');
const Utils = require('../helpers/utils');
const Product = require('../model/index');
const Tag = require('../../../common/schema/Tag');
const { profile } = require('winston');

const createProduct = async (req, res, next) => {
  try {
    const payload = req.body;
    const existedTags = await Tag.find({});
    payload.tags = await Utils.handleTags(existedTags, payload.tags);

    const createdProduct = await Product.create(payload);
    return res.status(CREATED).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct,
    });
  } catch (error) {
    logger.error('Error create product ', error.message);
    next(
      new ErrorResponse(error.message, error.status || INTERNAL_SERVER_ERROR)
    );
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const populateCollection = 'tags';
    const limit = Number(req.query.limit) || PAGE_LIMIT;
    const page = Number(req.query.page) || 1;
    const options = {
      skip: limit * page - limit,
      limit: limit,
    };
    const searchQuery = Utils.formatSearchQuery(req.query.search);
    const count = await Product.count(searchQuery);
    const products = await Product.find(
      searchQuery,
      options,
      populateCollection
    );

    const result = products.map(p => {
      const tags = p.tags.map(tag => tag.name);
      return {
        ...p._doc, tags
      };
    });

    return res.status(OK).json({
      success: true,
      message: 'Products loaded successfully',
      count,
      totalPages: Math.ceil(count / limit),
      limit,
      data: result,
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
  const populateCollection = 'tags';
  const result = {};
  try {
    const product = await Product.findById(id, {}, populateCollection);
    if (!product) {
      return next(new ErrorResponse('Product not exist', NOT_FOUND));
    }
    const tags = product.tags.map((tag) => tag._id) || null;
    if (tags.length > 0) {
      result.relatedProducts = await Product.find(
        {
          $and: [
            {
              tags: { $in: tags },
            },
            { _id: { $ne: product._id } },
          ],
        },
        {
          select: {
            name: 1,
            secondName: 1,
            description: 1,
            type: 1,
            price: 1,
            version: 1,
          },
        }
      );
    }
    result.product = product;
    return res.status(OK).json({
      success: true,
      message: 'Product loaded successfully',
      data: result,
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
  const populateCollection = 'tags';
  try {
    const product = await Product.findById(id, { _id: 1 }, populateCollection);
    if (!product) {
      return next(new ErrorResponse('Product not exist', NOT_FOUND));
    }
    const updatePayload = req.body;
    const existedTags = await Tag.find({});
    updatePayload.tags = await Utils.handleTags(
      existedTags,
      updatePayload.tags
    );

    const result = await Product.updateById(
      id,
      updatePayload,
      populateCollection
    );
    return res.status(OK).json({
      success: true,
      message: 'Product updated successfully',
      data: result,
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
    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorResponse('Product not exist', NOT_FOUND));
    }
    const result = await Product.deleteById(id);
    return res.status(OK).json({
      success: true,
      message: 'Product deleted successfully',
      data: result,
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
