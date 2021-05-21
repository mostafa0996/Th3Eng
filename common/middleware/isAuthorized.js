const {
  UNAUTHORIZED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR
} = require('http-status-codes');
const passport = require('passport');
const rbac = require('../rbac/rbac');

const isAuthorized = endPointName => {
  return (req, res, next) => {
    try {
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer')
      ) {
        return res.status(UNAUTHORIZED)
          .json({ status: false, message: 'Unauthorized'});
      }
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(UNAUTHORIZED)
          .json({ status: false, message: 'Unauthorized'});
      }
      passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err) {
          return res.status(INTERNAL_SERVER_ERROR)
            .json({ status: false, message: err.message});
        }
        req.user = user;
        const isAllowed = await rbac.can(req.user.roles, endPointName, {
          requestUserId: user._id.toString(),
          requestParameterId: req.params.id,
          isPhoneVerified: user.isPhoneVerified
        });
        if (!isAllowed) {
          return res.status(FORBIDDEN)
            .json({ status: false, message: 'Access to the requested URL is Forbidden'});
        }
        return next();
      })(req, res, next);
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR)
        .json({ status: false, message: err.message});
    }
  };
};

module.exports = isAuthorized;
