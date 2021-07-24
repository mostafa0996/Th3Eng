const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const _ = require('lodash');
const { Category, Image } = require('../../../common/init/db/init-db');
const ErrorResponse = require('../../../common/utils/errorResponse');
const { Op } = require('sequelize');

class Utils {
  static handleCategories = async (
    existedCategories,
    requestedCategories,
    blogId
  ) => {
    try {
      //get all categoriesName
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
        notExistedCategories.forEach(async (ele) => {
          const category = await Category.create(ele);
          category.addBlog(blogId, category.id);
        });
      }
      if (existedCategories) {
        existedCategories.forEach(async (cat) => {
          await cat.addBlog(blogId, cat.id);
        });
      }

      return requestedCategories;
    } catch (error) {
      throw new ErrorResponse(error.message, INTERNAL_SERVER_ERROR);
    }
  };

  static formatSearchQuery = (query) => {
    const formattedQuery = {};
    const categoryFormattedQuery = {};
    if (query.text && query.text != '') {
      formattedQuery[Op.or] = [
        {
          title: { [Op.like]: `%${query.text}%` },
        },
        {
          description: { [Op.like]: `%${query.text}%` },
        },
      ];
    }

    if (query.categories) {
      const categories = query.categories.split(',');
      categoryFormattedQuery.name = { [Op.in]: categories };
    }

    return { formattedQuery, categoryFormattedQuery };
  };

  static groupBlogsById = (blogs) => {
    const result = [];
    const dictionary = {};
    blogs.forEach((blog) => {
      dictionary[blog._id] = [];
    });
    blogs.forEach((blog) => {
      dictionary[blog._id].push(blog.categories.name);
    });
    Object.keys(dictionary).forEach((ele) => {
      blogs.forEach((blog) => {
        if (blog._id == ele) {
          result.push({ ...blog, categories: dictionary[ele] });
        }
      });
    });
    return result.filter(
      (v, i, a) => a.findIndex((t) => t._id === v._id) === i
    );
  };

  static handleImages = async (images, blogId) => {
    images.forEach(async (image) => {
      const payload = {
        image,
        blogId,
      };
      await Image.create(payload);
    });
  };

  static formatResult = (blogs) =>
    blogs.map((row) => {
      const _id = row.id;
      const images = Object.values(row.images);
      delete row.images;
      delete row.id;
      return {
        _id,
        images,
        ...row,
      };
    });
}

module.exports = Utils;
