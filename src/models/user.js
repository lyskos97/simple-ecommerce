const mongoose = require('mongoose');
const { hashSync, compareSync } = require('bcrypt');
const Product = require('./product');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20
    },
    cart: {
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

UserSchema.pre('save', function(next) {
  this.password = hashSync(this.password, 10);
  next();
});

UserSchema.methods.validatePassword = function(rawPassword) {
  return compareSync(rawPassword, this.password);
};

UserSchema.methods.getCartProducts = async function() {
  return Product.find({ id: { $in: this.cart } });
};

module.exports = mongoose.model('User', UserSchema);
