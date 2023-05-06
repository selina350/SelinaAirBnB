require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';


const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );

  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );

const routes = require('./routes');
app.use(routes);

// // app.use('/', require('./routes/verification'));
// app.use('/signup', require('./routes/signup'));
// app.use('/login', require('./routes/login'));
// // app.use('/users', require('./routes/users'));
// // app.use('/spots', require('./routes/spots'));
// // app.use('/reviews', require('./routes/reviews'));

module.exports = app;
