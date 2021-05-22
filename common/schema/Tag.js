const mongoose = require('mongoose');

const { Schema } = mongoose;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  {
    collection: 'tags',
    timestamps: true,
    versionKey: false,
  }
);

const Tag = mongoose.model('tags', TagSchema);

module.exports = Tag;
