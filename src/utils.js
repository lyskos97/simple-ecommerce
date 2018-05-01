const User = require('./models/user');

module.exports = {
  middlewares: {
    authenticate: (req, res, next) => {
      if (req.session && req.session.userId) next();
      else {
        res.render('page404');
      }
    }
  },
  getUserFromSession: async req => {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId);

      if (user) {
        const { lastName, firstName } = user;

        return { lastName, firstName };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
};
