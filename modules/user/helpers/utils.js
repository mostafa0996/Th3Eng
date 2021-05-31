class Utils {
  static formatSearchOptions = (options) => {
    const query = {};
    if (options.role) query.roles = { $elemMatch: { $eq: options.role } };

    return query;
  };
}

module.exports = Utils;
