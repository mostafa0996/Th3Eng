const Joi = require('@hapi/joi');

module.exports = {
  getAllBlogsSchema: {
    query: Joi.object().keys({
      page: Joi.number(),
      limit: Joi.number(),
      text: Joi.string(),
      categories: Joi.string(),
    }),
  },

  createBlogSchema: {
    body: Joi.object()
      .required()
      .keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        images: Joi.array().items(Joi.string()).required(),
        categories: Joi.array().items(Joi.string()).min(1).required(),
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
        blogData: Joi.object().keys({
          title: Joi.string().required(),
          description: Joi.string().required(),
          images: Joi.array().items(Joi.string()).required(),
          categories: Joi.array().items(Joi.string()).min(1).required(),
          cover: Joi.string().required(),
        }),
        visibility: Joi.boolean(),
      })
      .xor('blogData', 'visibility'),
  },

  deleteBlogSchema: {
    params: Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
  },
};
