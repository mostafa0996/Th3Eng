const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PRODUCT_TYPE } = require('../helpers/constants');
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    secondName: {
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
      default: true
    },
  },
  {
    collection: 'products',
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;
