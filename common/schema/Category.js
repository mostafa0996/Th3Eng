const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  {
    collection: 'categories',
    timestamps: true,
    versionKey: false,
  }
);

const Category = mongoose.model('categories', CategorySchema);

module.exports = Category;
