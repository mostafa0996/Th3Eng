const Product = require('../schema');

const create = async (payload) => Product.create(payload);

const find = async (selector = {}, options = {}) => {
  selector.visibility = true;
  const { sort, skip, limit, select } = options;
  return Product.find(selector).select(select).sort(sort).skip(skip).limit(limit);
};

const findById = async (id, options = {}) => {
  const { select } = options;
  return Product.findById(id).select(select);
};

const findOne = async (selector, options = {}) => {
  const { select } = options;
  return Product.findOne(selector).select(select);
};

const updateById = async (id, updatePaylod) => {
  return Product.findByIdAndUpdate(id, updatePaylod, {
        new: true,
        runValidators: true,
        context: 'query',
      });
};

const updateOne = async (selector, updatePaylod) => {
  return Product.findOneAndUpdate(selector, updatePaylod, {
    new: true,
    runValidators: true,
  });
};

const update = async (selector, updatePaylod) => {
  return Product.updateMany(selector, updatePaylod, {
    new: true,
    runValidators: true,
    multi: true,
  });
};

const deleteById = async (id) => Product.findByIdAndDelete(id);

const deleteOne = async (selector) => Product.deleteOne(selector);

const deleteMany = async (selector) => Product.deleteMany(selector);

const count = async (selector = {}) => {
  selector.visibility = true;
  return Product.countDocuments(selector);
};

module.exports = {
  create,
  find,
  findById,
  findOne,
  updateById,
  updateOne,
  update,
  deleteById,
  deleteOne,
  deleteMany,
  count,
};
