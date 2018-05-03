const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('page404');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/logout', (req, res, err) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) return next(err);
      else res.redirect('/');
    });
  }
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) res.json({ message: 'User with such email already exists' });
  else {
    try {
      const newUser = await User.create({ email, password });

      req.session.userId = newUser._id;
      res.redirect('/');
    } catch (e) {
      res.json({ error: e });
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user && !password) res.json({ message: 'No user with such email' });
  else {
    const valid = await user.validatePassword(password);

    if (valid) {
      req.session.userId = user._id;
      res.redirect('/');
    } else {
      res.json({ message: 'Invalid password' });
    }
  }
});

module.exports = router;
