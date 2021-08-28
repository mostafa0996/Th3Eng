const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const _ = require('lodash');
const { Category } = require('../../../common/init/db/init-db');
const ErrorResponse = require('../../../common/utils/errorResponse');
const { Op } = require('sequelize');
const { roles } = require('../../../common/enum/roles');

class Utils {
  static handleCategories = async (existedCategories, requestedCategories) => {
    try {
      const existedCategoriesNames = existedCategories.map((ele) => ele.name);

      //convert categories to lowercase
      requestedCategories = requestedCategories.map((cat) => cat.toLowerCase());

      // find not existed categories to create them
      let notExistedCategories = _.difference(
        requestedCategories,
        existedCategoriesNames
      );
      notExistedCategories = notExistedCategories.map((ele) => ({ name: ele }));

      if (notExistedCategories) {
        await Category.bulkCreate(notExistedCategories);
      }

      return requestedCategories.join(',');
    } catch (error) {
      throw new ErrorResponse(error.message, INTERNAL_SERVER_ERROR);
    }
  };

  static formatSearchQuery = (query, user) => {
    const formattedQuery = {};

    if (user && user.role == roles.CUSTOMER) {
      formattedQuery.visibility = true;
    }

    if (query.text && query.text != '') {
      formattedQuery[Op.or] = [
        {
          title: { [Op.like]: `%${query.text}%` },
        },
        {
          description: { [Op.like]: `%${query.text}%` },
        },
        {
          categories: { [Op.like]: `%${query.text}%` },
        },
      ];
    }

    if (query.categories) {
      formattedQuery.categories = { [Op.like]: `%${query.categories.replace(/ /g,"")}%` };
    }

    return { formattedQuery };
  };

  static formatResult = (blogs) =>
    blogs.map((row) => {
      const _id = row.id;
      const images = row.images.split(',');
      const categories = row.categories.split(',');
      delete row.id;
      delete row.images;
      delete row.categories;
      return {
        _id,
        images,
        categories,
        ...row,
      };
    });
}

module.exports = Utils;
