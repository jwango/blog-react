const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');

const ContainerContext = require('../lib/services/container-context');
const apiRouter = require('./routes/api');

process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const expressApp = function(middleRouter) {
  const app = express();

  // view engine setup
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Initialize Container
  const container = ContainerContext;
  app.use('/api/v1', apiRouter(container));

  app.use(middleRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // TODO: render the error page
    res.status(err.status || 500);
    res.send(err.message);
  });

  return app;
};

module.exports = expressApp;
