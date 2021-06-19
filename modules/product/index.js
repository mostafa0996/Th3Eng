const express = require('express');
const router = express.Router();

const isAuthorized = require('../../common/middleware/isAuthorized');
const validateRequest = require('../../common/middleware/validateRequest');

const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('./controller/index');

const {
  getAllProductsSchema,
  createProductSchema,
  getProductSchema,
  updateProductSchema,
  deleteProductSchema,
} = require('./joi/index');

const {
  PRODUCT_CREATE_PRODUCT,
  PRODUCT_DELETE_PRODUCT,
  PRODUCT_GET_ALL_PRODUCTS,
  PRODUCT_GET_PRODUCT,
  PRODUCT_UPDATE_PRODUCT,
} = require('./helpers/constants');

router.get(
  '/',
  //   isAuthorized(PRODUCT_GET_ALL_PRODUCTS),
  validateRequest(getAllProductsSchema),
  getAllProducts
);

router.post(
  '/',
  //   isAuthorized(PRODUCT_CREATE_PRODUCT),
  validateRequest(createProductSchema),
  createProduct
);

router.get(
  '/:id',
//   isAuthorized(PRODUCT_GET_PRODUCT),
  validateRequest(getProductSchema),
  getProduct
);
router.put(
  '/:id',
//   isAuthorized(PRODUCT_UPDATE_PRODUCT),
  validateRequest(updateProductSchema),
  updateProduct
);
router.delete(
  '/:id',
//   isAuthorized(PRODUCT_DELETE_PRODUCT),
  validateRequest(deleteProductSchema),
  deleteProduct
);

module.exports = router;
