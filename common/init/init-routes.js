const config = require('../config/configuration');
const errorHandler = require('../middleware/errorHandler');
// Route files
const userRoutes = require('../../modules/user');
const blogRoutes = require('../../modules/blog');

/**
 * @function
 * Registers all app routes
 *
 * @param {object} app - Express app.
 */
module.exports = (app) => {
  app.use(`${config.baseUrl}/users`, userRoutes);
  app.use(`${config.baseUrl}/blogs`, blogRoutes);

  // Central error handler
  app.use(errorHandler);
};
