const Joi = require('@hapi/joi');
const { PRODUCT_TYPE } = require('../helpers/constants');

module.exports = {
  getAllProductsSchema: {
    query: Joi.object()
      .keys({
        page: Joi.number(),
        limit: Joi.number(),
        text: Joi.string(),
        type: Joi.string().valid(...Object.values(PRODUCT_TYPE)),
        minPrice: Joi.number().min(1),
        maxPrice: Joi.number().min(1),
        tags: Joi.string(),
      })
      .required(),
  },

  createProductSchema: {
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().required(),
        secondName: Joi.string().required(),
        description: Joi.string().required(),
        screenshots: Joi.array().items(Joi.string()).min(1).required(),
        tags: Joi.array().items(Joi.string()).required(),
        type: Joi.string()
          .valid(...Object.values(PRODUCT_TYPE))
          .required(),
        price: Joi.number().required(),
        version: Joi.string().optional(),
        file: Joi.string(),
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
        productData: Joi.object().keys({
          name: Joi.string().required(),
          secondName: Joi.string().required(),
          description: Joi.string().required(),
          screenshots: Joi.array().items(Joi.string()).required(),
          tags: Joi.array().items(Joi.string()).min(1).required(),
          type: Joi.string()
            .valid(...Object.values(PRODUCT_TYPE))
            .required(),
          price: Joi.number().required(),
          version: Joi.string().optional(),
          file: Joi.string(),
        }),
        visibility: Joi.boolean(),
      })
      .xor('productData', 'visibility'),
  },

  deleteProductSchema: {
    params: Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
  },
};
