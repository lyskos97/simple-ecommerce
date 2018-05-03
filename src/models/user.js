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
      type: [mongoose.Schema.Types.ObjectId]
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

UserSchema.methods.getCart = async function() {
  return Product.find({ _id: { $in: this.cart } });
};

UserSchema.methods.addToCart = async function(id) {
  if (this.cart.indexOf(id) > -1) throw new Error('Already added to cart');
  else {
    this.cart.push(id);
  }
};

module.exports = mongoose.model('User', UserSchema);
