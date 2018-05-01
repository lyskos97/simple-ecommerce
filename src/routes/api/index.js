const express = require('express');
const Product = require('../../models/product');
const User = require('../../models/user');

const {
  middlewares: { authenticate }
} = require('../../utils');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.json({ success: true });
});

router.post('/products/add', async (req, res) => {
  const newProduct = await Product.create(req.body);

  if (newProduct) {
    res.json({ success: true, id: newProduct.id });
  } else res.json({ success: false });
});

router.get('/products', async (req, res) => {
  const products = await Product.find().limit(10);

  if (products.length === 0) res.json({ message: 'There are no products' });
  else res.json({ data: products });
});

router.get('/users', async (req, res) => {
  const users = await User.find().limit(10);

  if (users.length === 0) res.json({ message: 'There are no users' });
  else {
    res.json({ data: users });
  }
});

router.post('/cart/add', async (req, res) => {
  const {
    user,
    body: { productId }
  } = req;

  await User.findByIdAndUpdate({ _id: user.id }, { $push: { cart: productId } });

  console.log(object);
  console.log('originalUrl', req.originalUrl);
  console.log('url', req.url);
  console.log('baseUrl', req.baseUrl);

  res.redirect('/');
});

module.exports = router;
