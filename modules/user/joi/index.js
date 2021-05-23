const Joi = require('@hapi/joi');

module.exports = {
  loginSchema: {
    body: Joi.object().required().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
};
