const {
  roles: { ADMIN, CUSTOMER, MODERATOR },
} = require('../../enum/roles');

const adminPolicy = require('./adminPolicy');

const opts = {
  [ADMIN]: adminPolicy,
};

module.exports = opts;
