const mongoose = require('mongoose');
const { hashSync, compareSync } = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: Number
    }
  },
  {
    timestamps: true,
    collection: 'products'
  }
);

module.exports = mongoose.model('Product', UserSchema);
