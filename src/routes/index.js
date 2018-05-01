const express = require('express');

const authRoutes = require('./auth');
const apiRoutes = require('./api');
const productRoutes = require('./products');

const Product = require('../models/product');
const User = require('../models/user');

const {
  getUserFromSession,
  middlewares: { authenticate }
} = require('../utils');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/api', apiRoutes);
router.use('/products', productRoutes);

router.get('/', async (req, res) => {
  const products = await Product.find().limit(10);
  const user = await getUserFromSession(req);

  res.render('index', {
    products: products.length > 0 ? products : null,
    user: user ? user : null
  });
});

router.get('/about', async (req, res) => {
  const user = await getUserFromSession(req);

  res.render('about', { user });
});

router.get('*', (req, res) => {
  res.status(404).render('page404');
});

module.exports = router;
