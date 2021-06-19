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
    photo:{
      type: String,
      required: true,
    },
    screenshots: {
      type: [String],
      required: true,
    },
    categories: {
      type:[{ type: Schema.Types.ObjectId, ref: 'categories' }],
      required: true,
    },
    visibility: {
      type: Boolean,
      required: true,
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
