const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/user');
const { secret } = require('../../../private/jwt');

router.get('/', (req, res) => {
  res.json({ message: 'get out' });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) res.json({ message: 'User with such email already exists' });
  else {
    try {
      const newUser = await User.create({ email, password });

      req.session.userId = newUser._id;
      res.json({ success: true, id: newUser.id });
    } catch (e) {
      res.json({ error: e });
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  console.log('login body', req.body);

  if (!user && !password) res.json({ message: 'No user with such email' });
  else {
    const valid = await user.validatePassword(password);

    if (valid) {
      // const token = jwt.sign({ id: user.id }, secret);
      // res.json({ token });

      req.session.userId = user._id;
    } else {
      res.json({ message: 'Invalid password' });
    }
  }
});

module.exports = router;
