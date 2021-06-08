const express = require('express');
const router = express.Router();

const isAuthorized = require('../../common/middleware/isAuthorized');
const validateRequest = require('../../common/middleware/validateRequest');

const {
  getAllBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
} = require('./controller/index');

const {
  getAllBlogsSchema,
  createBlogSchema,
  getBlogSchema,
  updateBlogSchema,
  deleteBlogSchema,
} = require('./joi/index');

const {
  BLOG_CREATE_BLOG,
  BLOG_DELETE_BLOG,
  BLOG_GET_ALL_BLOGS,
  BLOG_GET_BLOG,
  BLOG_UPDATE_BLOG,
} = require('./helpers/constants');

router.get(
  '/',
  //   isAuthorized(BLOG_GET_ALL_BLOGS),
  validateRequest(getAllBlogsSchema),
  getAllBlogs
);

router.post(
  '/',
  //   isAuthorized(BLOG_CREATE_BLOG),
  validateRequest(createBlogSchema),
  createBlog
);

router.get(
  '/:id',
//   isAuthorized(BLOG_GET_BLOG),
  validateRequest(getBlogSchema),
  getBlog
);
router.put(
  '/:id',
//   isAuthorized(BLOG_UPDATE_BLOG),
  validateRequest(updateBlogSchema),
  updateBlog
);
router.delete(
  '/:id',
//   isAuthorized(BLOG_DELETE_BLOG),
  validateRequest(deleteBlogSchema),
  deleteBlog
);

module.exports = router;
