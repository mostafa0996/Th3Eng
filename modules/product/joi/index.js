const Joi = require('@hapi/joi');
const { objectId } = require('../../../common/validation/custom.validations');
const { PRODUCT_TYPE } = require('../helpers/constants');

module.exports = {
  getAllProductsSchema: {
    query: Joi.object().keys({
      page: Joi.number(),
      limit: Joi.number(),
    }),
  },

  createProductSchema: {
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().required(),
        secondName: Joi.string().required(),
        description: Joi.string().required(),
        screenshots: Joi.array().items(Joi.string()).required(),
        tags: Joi.array().items(Joi.string()).required(),
        type: Joi.number().valid(...Object.values(PRODUCT_TYPE)).required()
      }),
  },

  getProductSchema: {
    params: Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
  },

  updateProductSchema: {
    params: Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().required(),
        secondName: Joi.string().required(),
        description: Joi.string().required(),
        screenshots: Joi.array().items(Joi.string()).required(),
        tags: Joi.array().items(Joi.string()).required(),
        type: Joi.number().valid(...Object.values(PRODUCT_TYPE)).required()
      }),
  },

  deleteProductSchema: {
    params: Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
  },
};
