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
        title: Joi.string().required(),
        description: Joi.string().required(),
        images: Joi.array().items(Joi.string()).required(),
        categories: Joi.array().items(Joi.string()).required(),
        cover: Joi.string().required(),
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
        title: Joi.string().required(),
        description: Joi.string().required(),
        images: Joi.array().items(Joi.string()).required(),
        categories: Joi.array().items(Joi.string()).required(),
        cover: Joi.string().required(),
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
