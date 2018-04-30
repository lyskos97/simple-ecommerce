const express = require('express');

const authRoutes = require('./auth');
const apiRoutes = require('./api');

const Product = require('../models/product');
const User = require('../models/user');
const { authenticate } = require('../middlewares');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/api', apiRoutes);

router.get('/', async (req, res) => {
  const products = await Product.find().limit(10);

  if (req.session && req.session.userId) {
    const { firstName, lastName, ...other } = await User.findById(req.session.userId);

    res.render('index', { products, user: { firstName, lastName } });
  } else {
    res.render('index', { products });
  }
});

router.get('*', (req, res) => {
  res.status(404).render('page404');
});

module.exports = router;
