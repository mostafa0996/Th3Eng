const {
    BLOG_GET_ALL_BLOGS,
    BLOG_GET_BLOG,
    PRODUCT_GET_ALL_PRODUCTS,
    PRODUCT_GET_PRODUCT,
    USER_GET_USER,
  } = require('./endpoints');
  
  module.exports = {
    can: [
      BLOG_GET_ALL_BLOGS,
      BLOG_GET_BLOG,
      PRODUCT_GET_ALL_PRODUCTS,
      PRODUCT_GET_PRODUCT,
      USER_GET_USER,
    ],
  };
  