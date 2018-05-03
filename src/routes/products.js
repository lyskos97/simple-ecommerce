const express = require('express');
const cloudinary = require('cloudinary');
const Formidable = require('formidable');

const User = require('../models/user');
const Product = require('../models/product');
const {
  getUserFromSession,
  middlewares: { authenticate }
} = require('../utils');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const cdn = cloudinary.v2.uploader;

router.get('/add', (req, res) => {
  res.render('addProduct');
});

router.post('/add', async (req, res) => {
  const form = new Formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    const image = await cdn.upload(files.photo.path, { width: 400, height: 400, format: 'png' });

    const newProduct = await Product.create({
      title: fields.title,
      description: fields.description,
      imageUrl: image.url
    });
  });

  res.redirect('/');
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (id) {
    const product = await Product.findById(id);
    const user = await getUserFromSession(req, { full: true });

    const isInCart = user.cart.find(p => {
      if (p.id === product.id) return true;
      return false;
    });

    res.render('product', {
      product: product ? product : null,
      user: user ? user : null,
      isInCart
    });
  }
});

router.get('/:id/delete', authenticate, async (req, res) => {
  const user = await Product.findByIdAndRemove(req.params.id);

  res.redirect('/');
});

router.delete('/:id', authenticate, async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  res.redirect('/');
});

router.get('/:id/add_to_cart', authenticate, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.session.userId && req.session.userId },
      { $push: { cart: req.params.id } },
      { new: true }
    );

    res.redirect('/profile');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
