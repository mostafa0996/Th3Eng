const _ = require('lodash');
const Category = require('../../../common/schema/Category');

class Utils {
  static handleCategories = async (existedCategories, categories) => {
    //get all categoriesName
    const existedCategoriesNames = existedCategories.map((ele) => ele.name);

    //convert categories to lowercase
    categories = categories.map((cat) => cat.toLowerCase());

    // get requested categories ids
    let payloadCategoriesIds = [];
    for (const payloadCategoryName of categories) {
      for (const existedCategory of existedCategories) {
        if (existedCategory.name == payloadCategoryName) {
          payloadCategoriesIds.push(existedCategory._id);
        }
      }
    }

    // find not existed categories to create them
    let notExistedCategories = _.difference(categories, existedCategoriesNames);
    notExistedCategories = notExistedCategories.map((ele) => ({ name: ele }));
    let createdCategories;
    if (notExistedCategories) {
      createdCategories = await Category.insertMany(notExistedCategories);
    }
    const createdCategoriesIds = createdCategories.map((ele) => ele._id);
    categories = createdCategoriesIds.length
      ? [...payloadCategoriesIds, ...createdCategoriesIds]
      : [...payloadCategoriesIds];
    return categories;
  };

  static formatSearchQuery = (text) => {
    const query = {};
    if (text && text != '') {
      query.$or = [
        {
          title: {$regex: text},
        },
        {
          description: {$regex: text},
        },
      ];
    }
    return query;
  };
}

module.exports = Utils;
