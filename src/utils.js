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
  getUserFromSession: async (req, params) => {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId);
      const { lastName, firstName, email } = user;

      if (user) {
        if (params && params.full) {
          return {
            lastName,
            firstName,
            email,
            cart: await user.getCart()
          };
        } else return { lastName, firstName, email };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
};
