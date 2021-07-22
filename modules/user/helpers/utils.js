const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../common/config/configuration');

class Utils {
  static formatSearchOptions = (options) => {
    const query = {};
    if (options.role) query.roles = { $elemMatch: { $eq: options.role } };

    return query;
  };

  static validatePassword = (enteredPassword, password) => {
    return bcrypt.compare(enteredPassword, password);
  };

  static generateJWT = (id, role, verified) => {
    return jwt.sign({ id, role, verified }, config.jwt.key, {
      algorithm: 'HS256',
      expiresIn: config.jwt.expire,
    });
  };

  static toAuthJSON = (user) => {
    const { id, role, verified } = user;
    const token = this.generateJWT(id, role, verified);
    return {
      id,
      role,
      verified,
      token: `Bearer ${token}`,
    };
  };
}

module.exports = Utils;
