const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PRODUCT_TYPE } = require('../helpers/constants');
const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    os: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
      custom() {
        if (this.isSet || this.value) {
          return;
        }

        if (this.field('type').value == PRODUCT_TYPE.PAID) {
          return 'required';
        }
      },
    },
    type: {
      type: Number,
      enum: Object.values(PRODUCT_TYPE),
      required: true
    },
    screenshots: {
      type: [String],
      required: true,
    },
    tags: {
      type:[{ type: Schema.Types.ObjectId, ref: 'tags' }],
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

const Product = mongoose.model('blogs', ProductSchema);

module.exports = Product;
