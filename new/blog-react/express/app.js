const express = require('express');
const createError = require('http-errors');
const cors = require('cors');
const logger = require('morgan');

const Container = require('./container');
const MongoService = require('./services/mongo.service');
const PostsServiceMock = require('./services/posts.service.mock');
const PostsService = require('./services/posts.service');
const TagsService = require('./services/tags.service');
const apiRouter = require('./routes/api');

process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const expressApp = function(middleRouter) {
  const app = express();

  // view engine setup
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // enable CORS for my app
  app.use(cors());

  // Initialize Container
  const container = Object.create(Container);
  container.register('serviceConfig', true, async function(container) {
    return {
      url: process.env.MONGODB_URI
    };
  });
  container.register('mongoService', true, async function(container) {
    var instance = Object.create(MongoService);
    await instance.init(container);
    await instance.getConnectedClient();
    return instance;
  });
  container.register('postsService', true, async function(container) {
    var instance = Object.create(PostsService);
    await instance.init(container);
    return instance;
  });
  container.register('tagsService', true, async function(container) {
    var instance = Object.create(TagsService);
    await instance.init(container);
    return instance;
  });

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
