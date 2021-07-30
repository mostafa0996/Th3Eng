const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const _ = require('lodash');
const { Tag, Screenshot } = require('../../../common/init/db/init-db');
const ErrorResponse = require('../../../common/utils/errorResponse');
const { Op } = require('sequelize');
class Utils {
  static handleTags = async (
    existedTags,
    requestedTags,
    productId
  ) => {
    try {
      //get all categoriesName
      const existedTagsNames = existedTags.map((ele) => ele.name);

      //convert categories to lowercase
      requestedTags = requestedTags.map((cat) => cat.toLowerCase());

      // find not existed categories to create them
      let notexistedTags = _.difference(
        requestedTags,
        existedTagsNames
      );
      notexistedTags = notexistedTags.map((ele) => ({ name: ele }));

      if (notexistedTags) {
        notexistedTags.forEach(async (ele) => {
          const tag = await Tag.create(ele);
          tag.addProduct(productId, tag.id);
        });
      }
      if (existedTags) {
        existedTags.forEach(async (tag) => {
          await tag.addProduct(productId, tag.id);
        });
      }

      return requestedTags;
    } catch (error) {
      throw new ErrorResponse(error.message, INTERNAL_SERVER_ERROR);
    }
  };

  static formatSearchQuery = (query) => {
    const formattedQuery = {};
    const tagFormattedQuery = {};

    if (query.text && query.text != '') {
      formattedQuery[Op.or]  = [
        {
          name: { [Op.like]: `%${query.text}%` },
        },
        {
          secondName: { [Op.like]: `%${query.text}%` },
        },
        {
          description: { [Op.like]: `%${query.text}%` },
        },
      ];
    }
    if (query.type) {
      formattedQuery.type = Number(query.type);
    }
    if (query.minPrice) {
      formattedQuery.price = {[Op.gte]: Number(query.minPrice) };
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
      const tags = query.tags.split(',');
      tagFormattedQuery.name = { [Op.in]: tags };
    }

    return { formattedQuery, tagFormattedQuery };
  };

  static groupProductsById = (products) => {
    const result = [];
    const dictionary = {};
    products.forEach((product) => {
      dictionary[product._id] = [];
    });
    products.forEach((product) => {
      dictionary[product._id].push(product.tags.name);
    });
    Object.keys(dictionary).forEach((ele) => {
      products.forEach((product) => {
        if (product._id == ele) {
          result.push({ ...product, tags: dictionary[ele] });
        }
      });
    });
    return result.filter(
      (v, i, a) => a.findIndex((t) => t._id === v._id) === i
    );
  };

  static handleScreenshots = async (screenshots, productId) => {
    screenshots.forEach(async (image) => {
      const payload = {
        image,
        productId,
      };
      await Screenshot.create(payload);
    });
  };

  static formatResult = (products) =>
    products.map((row) => {
      const _id = row.id;
      const screenshots = Object.values(row.screenshots);
      delete row.screenshots;
      delete row.id;
      return {
        _id,
        screenshots,
        ...row,
      };
    });
}

module.exports = Utils;
