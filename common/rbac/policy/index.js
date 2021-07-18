const {
  roles: { ADMIN, CUSTOMER, MODERATOR },
} = require('../../enum/roles');

const adminPolicy = require('./adminPolicy');
const moderatorPolicy = require('./moderatorPolicy');

const opts = {
  [ADMIN]: adminPolicy,
  [MODERATOR]: moderatorPolicy,
};
console.log(opts);

module.exports = opts;
