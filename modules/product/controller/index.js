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
const { Product, Tag, Screenshot } = require('../../../common/init/db/init-db');
const {
  handleTags,
  groupProductsById,
  formatSearchQuery,
  handleScreenshots,
  formatResult,
} = require('../helpers/utils');
const toLowerCaseArrayValues = require('../../../common/utils/toLowerCaseArrayValues');

const createProduct = async (req, res, next) => {
  try {
    const payload = req.body;
    const requestedTags = toLowerCaseArrayValues(payload.tags);
    delete payload.tags;
    const createdProduct = await Product.create(payload);
    await handleScreenshots(payload.screenshots, createdProduct.id);
    const existedTags = await Tag.findAll({
      where: {
        name: {
          [Op.in]: requestedTags,
        },
      },
      attributes: ['id', 'name'],
    });
    await handleTags(
      existedTags,
      requestedTags,
      createdProduct.id
    );
    createdProduct.dataValues.tags = requestedTags;
    return res.status(CREATED).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct,
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

    const { formattedQuery, tagFormattedQuery } = formatSearchQuery(
      req.query
    );
    const { rows, count } = await Product.findAndCountAll({
      where: { ...formattedQuery, visibility: true },
      distinct: true,
      include: [
        {
          model: Tag,
          where: tagFormattedQuery,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
        {
          model: Screenshot,
          attributes: ['image'],
        },
      ],
      raw: true,
      nest: true,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    let products = formatResult(rows);
    products = groupProductsById(products);
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
        visibility: true,
      },
      include: [
        {
          model: Tag,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
        {
          model: Screenshot,
          attributes: ['image'],
        },
      ],
      raw: true,
      nest: true,
    });
    if (!product.length) {
      return next(new ErrorResponse('Product not exist', NOT_FOUND));
    }
    product = formatResult(product);
    product = groupProductsById(product);

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
      const updatePayload = req.body.productData;
      const requestedTags = toLowerCaseArrayValues(
        updatePayload.categories
      );
      delete updatePayload.categories;

      const existedTags = await Category.findAll({
        where: {
          name: {
            [Op.in]: requestedTags,
          },
        },
        attributes: ['id', 'name'],
      });
      await handleTags(existedTags, requestedTags, id);
      await Product.update(updatePayload, {
        where: { id },
      });
    }
    result = await Product.findAll({
      where: {
        id,
        visibility: true,
      },
      include: [
        {
          model: Tag,
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
    result = groupProductsById(result);
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
