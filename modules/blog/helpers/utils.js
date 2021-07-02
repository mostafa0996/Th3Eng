const _ = require('lodash');
const Category = require('../../../common/schema/Category');

class Utils {
  static handleCategories = async (existedCategories, categories) => {
    //get all categoriesName
    const existedCategoriesNames = existedCategories.map((ele) => ele.name);

    //convert categories to lowercase
    categories = categories.map((cat) => cat.toLowerCase());

    // find not existed categories to create them
    let notExistedCategories = _.difference(categories, existedCategoriesNames);
    notExistedCategories = notExistedCategories.map((ele) => ({ name: ele }));
    
    if (notExistedCategories) {
      await Category.insertMany(notExistedCategories);
    }

    return categories;
  };

  static formatSearchQuery = (query) => {
    const formattedQuery = {};
    if (query.text && query.text != '') {
      formattedQuery.$or = [
        {
          title: { $regex: query.text },
        },
        {
          description: { $regex: query.text },
        },
        {
          categories: { $in: query.text },
        },
      ];
    }

    if (query.categories) {
      const categories = query.categories.split(',');
      formattedQuery.categories = { $in: categories };
    }

    return formattedQuery;
  };
}

module.exports = Utils;
