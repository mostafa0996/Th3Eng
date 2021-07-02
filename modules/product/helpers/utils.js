const _ = require('lodash');
const Tag = require('../../../common/schema/Tag');

class Utils {
  static handleTags = async (existedTags, tags) => {
    //get all tagsName
    const existedTagsNames = existedTags.map((ele) => ele.name);

    //convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    // find not existed tags to create them
    let notExistedTags = _.difference(tags, existedTagsNames);
    notExistedTags = notExistedTags.map((ele) => ({ name: ele }));

    if (notExistedTags) {
      await Tag.insertMany(notExistedTags);
    }

    return tags;
  };

  static formatSearchQuery = (query) => {
    const formattedQuery = {};
    if (query.text && query.text != '') {
      formattedQuery.$or = [
        {
          name: { $regex: query.text },
        },
        {
          secondName: { $regex: query.text },
        },
        {
          description: { $regex: query.text },
        },
        {
          tags: { $in: query.text },
        },
      ];
    }
    if (query.type) {
      formattedQuery.type = Number(query.type);
    }
    if (query.minPrice) {
      formattedQuery.price = { $gte: Number(query.minPrice) };
    }
    if (query.maxPrice) {
      formattedQuery.price = formattedQuery.price
        ? {
            ...formattedQuery.price,
            $lte: Number(query.maxPrice),
          }
        : { $lte: Number(query.maxPrice) };
    }

    if (query.tags) {
      const tags = query.tags.split(',');
      formattedQuery.tags = { $in: tags };
    }

    return formattedQuery;
  };
}

module.exports = Utils;
