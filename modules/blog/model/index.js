const Blog = require('../schema');

const create = async (payload) => Blog.create(payload);

const find = async (selector = {}, options = {}) => {
  selector.visibility = true;
  const { sort, skip, limit, select } = options;
  return Blog.find(selector).select(select).sort(sort).skip(skip).limit(limit);
};

const findById = async (id, options = {}) => {
  const { select } = options;
  return Blog.findById(id).select(select);
};

const findOne = async (selector, options = {}) => {
  const { select } = options;
  return Blog.findOne(selector).select(select);
};

const updateById = async (id, updatePaylod) => {
  return Blog.findByIdAndUpdate(id, updatePaylod, {
        new: true,
        runValidators: true,
        context: 'query',
      });
};

const updateOne = async (selector, updatePaylod) => {
  return Blog.findOneAndUpdate(selector, updatePaylod, {
    new: true,
    runValidators: true,
  });
};

const update = async (selector, updatePaylod) => {
  return Blog.updateMany(selector, updatePaylod, {
    new: true,
    runValidators: true,
    multi: true,
  });
};

const deleteById = async (id) => Blog.findByIdAndDelete(id);

const deleteOne = async (selector) => Blog.deleteOne(selector);

const deleteMany = async (selector) => Blog.deleteMany(selector);

const count = async (selector = {}) => {
  selector.visibility = true;
  return Blog.countDocuments(selector);
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
