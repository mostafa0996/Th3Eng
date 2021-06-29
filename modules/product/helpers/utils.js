const _ = require('lodash');
const Tag = require('../../../common/schema/Tag');

class Utils {
  static handleTags = async (existedTags, tags) => {
    //get all tagsName
    const existedTagsNames = existedTags.map((ele) => ele.name);

    //convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    // get requested tags ids
    let payloadTagsIds = [];
    for (const payloadTagName of tags) {
      for (const existedTag of existedTags) {
        if (existedTag.name == payloadTagName) {
          payloadTagsIds.push(existedTag._id);
        }
      }
    }

    // find not existed tags to create them
    let notExistedTags = _.difference(tags, existedTagsNames);
    notExistedTags = notExistedTags.map((ele) => ({ name: ele }));
    let createdTags;
    if (notExistedTags) {
      createdTags = await Tag.insertMany(notExistedTags);
    }
    const createdTagsIds = createdTags.map((ele) => ele._id);
    tags = createdTagsIds.length
      ? [...payloadTagsIds, ...createdTagsIds]
      : [...payloadTagsIds];
    return tags;
  };

  static formatSearchQuery = (text) => {
    const query = {};

    if (text && text != '') {
      query.$or = [
        {
          name: { $regex: text },
        },
        {
          secondName: { $regex: text },
        },
        {
          description: { $regex: text },
        },
      ];
    }
    return query;
  };
}

module.exports = Utils;
