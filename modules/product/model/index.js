const Product = require('../schema');

const create = async (payload) => Product.create(payload);

const find = async (selector = {}, options = {}, populateCollection = '') => {
  selector.visibility = true;
  const { sort, skip, limit, select } = options;
  return populateCollection.length > 0
    ? Product.find(selector)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populateCollection)
    : Product.find(selector).select(select).sort(sort).skip(skip).limit(limit);
};

const findById = async (id, options = {}, populateCollection = '') => {
  const { select } = options;
  return populateCollection.length > 0
    ? Product.findById(id).select(select).populate(populateCollection)
    : Product.findById(id).select(select);
};

const findOne = async (selector, options = {}, populateCollection = '') => {
  const { select } = options;
  return populateCollection.length > 0
    ? Product.findOne(selector).select(select).populate(populateCollection)
    : Product.findOne(selector).select(select);
};

const updateById = async (id, updatePaylod, populateCollection = '') => {
  return populateCollection.length > 0
    ? Product.findByIdAndUpdate(id, updatePaylod, {
        new: true,
        runValidators: true,
        context: 'query',
      }).populate(populateCollection)
    : Product.findByIdAndUpdate(id, updatePaylod, {
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
