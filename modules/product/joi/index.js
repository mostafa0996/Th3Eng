const Joi = require('@hapi/joi');
const { objectId } = require('../../../common/validation/custom.validations');

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
        title: Joi.string(),
        description: Joi.string(),
        screenshots: Joi.array().items(Joi.string()),
        categories: Joi.array().items(Joi.string()),
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
        title: Joi.string(),
        description: Joi.string(),
        screenshots: Joi.array().items(Joi.string()),
        categories: Joi.array().items(Joi.string()),
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
