const mongoose = require('mongoose');
const { hashSync, compareSync } = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number
    },
    imageUrl: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: 'products'
  }
);

module.exports = mongoose.model('Product', UserSchema);
