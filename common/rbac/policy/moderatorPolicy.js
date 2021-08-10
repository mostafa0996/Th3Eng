const {
  BLOG_CREATE_BLOG,
  BLOG_GET_ALL_BLOGS,
  BLOG_GET_BLOG,
  BLOG_UPDATE_BLOG,
} = require('./endpoints');

module.exports = {
  can: [
    BLOG_CREATE_BLOG,
    BLOG_GET_ALL_BLOGS,
    BLOG_GET_BLOG,
    BLOG_UPDATE_BLOG,
  ],
};
