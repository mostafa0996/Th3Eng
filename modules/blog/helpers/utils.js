const _ = require('lodash');
const Category = require('../../../common/schema/Category');

class Utils {
  static handleCategories = async (existedCategories, payload) => {
    //get all categoriesName
    const existedCategoriesNames = existedCategories.map((ele) => ele.name);

    //convert categories to lowercase
    payload.categories = payload.categories.map((cat) => cat.toLowerCase());

    // get requested categories ids
    let payloadCategoriesIds = [];
    for (const payloadCategoryName of payload.categories) {
      for (const existedCategory of existedCategories) {
        if (existedCategory.name == payloadCategoryName) {
          payloadCategoriesIds.push(existedCategory._id);
        }
      }
    }

    // find not existed categories to create them
    let notExistedCategories = _.difference(
      payload.categories,
      existedCategoriesNames
    );
    notExistedCategories = notExistedCategories.map((ele) => ({ name: ele }));
    let createdCategories;
    if (notExistedCategories) {
      createdCategories = await Category.insertMany(notExistedCategories);
    }
    const createdCategoriesIds = createdCategories.map((ele) => ele._id);
    payload.categories = createdCategoriesIds.length
      ? [...payloadCategoriesIds, ...createdCategoriesIds]
      : [...payloadCategoriesIds];
    return payload;
  };
}

module.exports = Utils;
