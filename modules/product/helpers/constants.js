const PRODUCT_TYPE = {
  FREE: 0,
  PAID: 1,
};

const endPoints = Object.freeze({
  PRODUCT_GET_ALL_PRODUCTS: 'product:getAllProducts',
  PRODUCT_CREATE_PRODUCT: 'product:createProduct',
  PRODUCT_GET_PRODUCT: 'product:getProduct',
  PRODUCT_UPDATE_PRODUCT: 'product:updateProduct',
  PRODUCT_DELETE_PRODUCT: 'product:deleteProduct',
});

module.exports = {
  endPoints,
  PRODUCT_TYPE,
};
