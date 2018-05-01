const express = require('express');
const cloudinary = require('cloudinary');
const Formidable = require('formidable');

const User = require('../models/user');
const Product = require('../models/product');
const {
  getUserFromSession,
  middlewares: { authenticate }
} = require('../utils');
const cdnConfig = require('../../private/cdn');

const router = express.Router();

cloudinary.config(cdnConfig);

const cdn = cloudinary.v2.uploader;

router.get('/add', (req, res) => {
  res.render('addProduct');
});

router.post('/add', async (req, res) => {
  const form = new Formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    const image = await cdn.upload(files.photo.path, { width: 400, height: 400, format: 'png' });

    console.log('fields', fields);

    const newProduct = await Product.create({
      title: fields.title,
      description: fields.description,
      imageUrl: image.url
    });
    console.log(newProduct);
  });

  res.redirect('/');
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (id) {
    const product = await Product.findById(id);
    const user = await getUserFromSession(req);

    res.render('product', {
      product: product ? product : null,
      user: user ? user : null
    });
  }
});

router.get('/:id/delete', authenticate, async (req, res) => {
  const user = await Product.findByIdAndRemove(req.params.id);

  res.redirect('/');
  console.log(user);
});

router.delete('/:id', authenticate, async (req, res) => {
  const user = await Product.findByIdAndRemove(req.params.id);

  console.log('DELETED', user.id);
  res.redirect('/');
});

module.exports = router;
