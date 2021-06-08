const Joi = require('@hapi/joi');
const { objectId } = require('../../../common/validation/custom.validations');

module.exports = {
  getAllBlogsSchema: {
    query: Joi.object().keys({
      page: Joi.number(),
      limit: Joi.number(),
    }),
  },

  createBlogSchema: {
    body: Joi.object()
      .required()
      .keys({
        title: Joi.string(),
        description: Joi.string(),
        screenshots: Joi.array().items(Joi.string()),
        categories: Joi.array().items(Joi.string()),
      }),
  },

  getBlogSchema: {
    params: Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
  },

  updateBlogSchema: {
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

  deleteBlogSchema: {
    params: Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
  },
};
