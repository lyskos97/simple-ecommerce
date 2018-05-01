const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');

const { secret } = require('../private/session');
const {
  middlewares: { authenticate }
} = require('./utils');

const routes = require('./routes');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

app.use('/', routes);

app.listen(PORT, () => {
  console.log('Express app on port', PORT);
});
