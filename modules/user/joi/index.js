const Joi = require('@hapi/joi');

module.exports = {
  loginSchema: {
    body: Joi.object().required().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },

  signUpSchema: {
    body: Joi.object().required().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phoneNumber: Joi.number().required(),
      email: Joi.string().email().required(),
      role: Joi.string().optional(),
      password: Joi.string().required(),
      country: Joi.string().required(),
    }),
  },

  userVerifySchema: {
    body: Joi.object()
      .keys({
        token: Joi.string().required(),
      })
      .required(),
  },

  userForgotPasswordSchema: {
    body: Joi.object()
      .keys({
        email: Joi.string().required(),
      })
      .required(),
  },

  userPasswordResetSchema: {
    params: Joi.object()
      .keys({
        token: Joi.string().required(),
      })
      .required(),
    body: Joi.object()
      .keys({
        password: Joi.string().required(),
      })
      .required(),
  },

  getAllUserSchema: {
    params: Joi.object().keys({
      role: Joi.string(),
    }),
  },
};
