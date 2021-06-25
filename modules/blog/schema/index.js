const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover:{
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    categories: {
      type:[{ type: Schema.Types.ObjectId, ref: 'categories' }],
      required: true,
    },
    visibility: {
      type: Boolean,
      default: true
    },
  },
  {
    collection: 'blogs',
    timestamps: true,
    versionKey: false,
  }
);

const Blog = mongoose.model('blogs', BlogSchema);

module.exports = Blog;
