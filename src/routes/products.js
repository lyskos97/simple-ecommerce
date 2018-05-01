const express = require('express');

const User = require('../models/user');
const Product = require('../models/product');
const { getUserFromSession } = require('../utils');

const router = express.Router();

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

module.exports = router;
