const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const _ = require('lodash');
const { Tag } = require('../../../common/init/db/init-db');
const ErrorResponse = require('../../../common/utils/errorResponse');
const { Op } = require('sequelize');
const { roles } = require('../../../common/enum/roles');

class Utils {
  static handleTags = async (existedTags, requestedTags) => {
    try {
      //get all tagsName
      const existedTagsNames = existedTags.map((ele) => ele.name);

      //convert tags to lowercase
      requestedTags = requestedTags.map((tag) => tag.toLowerCase());

      // find not existed tags to create them
      let notexistedTags = _.difference(requestedTags, existedTagsNames);
      notexistedTags = notexistedTags.map((ele) => ({ name: ele }));

      if (notexistedTags) {
        await Tag.bulkCreate(notexistedTags);
      }

      return requestedTags.join(',');
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
          name: { [Op.like]: `%${query.text}%` },
        },
        {
          secondName: { [Op.like]: `%${query.text}%` },
        },
        {
          description: { [Op.like]: `%${query.text}%` },
        },
        {
          tags: { [Op.like]: `%${query.text}%` },
        }
      ];
    }
    if (query.type) {
      formattedQuery.type = Number(query.type);
    }
    if (query.minPrice) {
      formattedQuery.price = { [Op.gte]: Number(query.minPrice) };
    }
    if (query.maxPrice) {
      formattedQuery.price = formattedQuery.price
        ? {
            ...formattedQuery.price,
            [Op.lte]: Number(query.maxPrice),
          }
        : { [Op.lte]: Number(query.maxPrice) };
    }

    if (query.tags) {
      formattedQuery.tags = { [Op.like]: `%${query.tags.replace(/ /g,"")}%` };
    }

    return { formattedQuery };
  };

  static formatResult = (products) =>
    products.map((row) => {
      const _id = row.id;
      const screenshots = row.screenshots.split(',');
      const tags = row.tags.split(',');
      delete row.id;
      delete row.screenshots;
      delete row.tags;
      return {
        _id,
        screenshots,
        tags,
        ...row,
      };
    });
}

module.exports = Utils;
