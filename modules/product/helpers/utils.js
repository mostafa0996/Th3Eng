const _ = require('lodash');
const Tag = require('../../../common/schema/Tag');

class Utils {
  static handleTags = async (existedTags, payload) => {
    //get all tagsName
    const existedTagsNames = existedTags.map((ele) => ele.name);

    //convert tags to lowercase
    payload.tags = payload.tags.map((tag) => tag.toLowerCase());

    // get requested tags ids
    let payloadTagsIds = [];
    for (const payloadTagName of payload.tags) {
      for (const existedTag of existedTags) {
        if (existedTag.name == payloadTagName) {
          payloadTagsIds.push(existedTag._id);
        }
      }
    }

    // find not existed tags to create them
    let notExistedTags = _.difference(
      payload.tags,
      existedTagsNames
    );
    notExistedTags = notExistedTags.map((ele) => ({ name: ele }));
    let createdTags;
    if (notExistedTags) {
      createdTags = await Tag.insertMany(notExistedTags);
    }
    const createdTagsIds = createdTags.map((ele) => ele._id);
    payload.tags = createdTagsIds.length
      ? [...payloadTagsIds, ...createdTagsIds]
      : [...payloadTagsIds];
    return payload;
  };
}

module.exports = Utils;
