const jwt = require('jsonwebtoken');

module.exports = {
  authenticate: (req, res, next) => {
    if (req.session && req.session.userId) next();
    else {
      res.render('page404');
      next(new Error('Not authorized'));
    }
  },
  handleAuthError: (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ message: 'No access' });
    } else {
      next();
    }
  }
};
