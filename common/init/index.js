const initRoutes = require('./init-routes');
const connectDB = require('./db/init-db');

/**
 * @function
 * Initializes app components
 *
 * @param {object} app - Express app.
 */
module.exports = (app) => {
  initRoutes(app);
  connectDB;
};
