var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var assetsMap = require('../../build/public/asset-manifest.json');
import Container from './container';
import MongoService from './services/mongo.service';
import PostsServiceMock from './services/posts.service.mock';
import PostsService from './services/posts.service';
import PostsController from './routes/posts.controller';

import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { App } from '../client/scenes/app/app.scene';
import React from 'react';
import fetch from 'isomorphic-fetch';
import serialize from 'serialize-javascript';

process.env.HOST = process.env.HOST || "http://localhost:3001";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
process.env.PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3001";
process.env.POSTS_SERVICE_MOCKED = !!process.env.POSTS_SERVICE_MOCKED || false;

var app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('build/public'));

// enable CORS for my app
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.HOST);
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Initialize Container
var container = Object.create(Container);
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
  var instance;
  if (process.env.POSTS_SERVICE_MOCKED === "true") {
    instance = Object.create(PostsServiceMock);
  } else {
    instance = Object.create(PostsService);
  }
  await instance.init(container);
  return instance;
});

// Connect handlers
let depKey;
for (let key in assetsMap) {
  if (key.startsWith('static/js/') && key.endsWith('.js')) {
    depKey = key;
  }
}

function renderPageHandler(contextPromise, req, res, next) {
  contextPromise
    .then((context) => {
      const markup = renderToString(
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      )

      const depScript = depKey ? `<script src="${assetsMap[depKey]}" defer></script>` : '';
      res.send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <link rel="manifest" href="/manifest.json">
            <link rel="shortcut icon" href="/favicon.ico">
            <title>andful</title>
            <link href="${assetsMap["main.css"]}" rel="stylesheet">
            <script>
              window.__INITIAL_DATA__ = ${serialize(context)}
              window.__GATEWAY_URL__ = ${process.env.HOST}
            </script>
            <script defer src="https://use.fontawesome.com/releases/v5.7.0/js/solid.js" integrity="sha384-6FXzJ8R8IC4v/SKPI8oOcRrUkJU8uvFK6YJ4eDY11bJQz4lRw5/wGthflEOX8hjL" crossorigin="anonymous"></script>
            <script defer src="https://use.fontawesome.com/releases/v5.7.0/js/fontawesome.js" integrity="sha384-av0fZBtv517ppGAYKqqaiTvWEK6WXW7W0N1ocPSPI/wi+h8qlgWck2Hikm5cxH0E" crossorigin="anonymous"></script>
          </head>
          <body id="root">
            <noscript>You need to enable JavaScript to run this app.</noscript>
            ${markup}
            ${depScript}
            <script src="${assetsMap["runtime~main.js"]}" defer></script>
            <script src="${assetsMap["main.js"]}" defer></script>
          </body>
        </html>
        `);
    })
    .catch((error) => {
      console.log(error);
      next(createError(500))
    });
}

function readStringStream(rs) {
  return new Promise((resolve, reject) => {
    let data = '';
    rs.on('data', (chunk) => data += chunk);
    rs.on('end', () => resolve(data));
    rs.on('error', (error) => reject(error.message));
  });
}

var postsController = Object.create(PostsController);
postsController.init(container);

app.use('/posts', postsController.getRouter());
app.get('/blog/posts/:postName', (req, res, next) => {
  const postId = req.params.postName.split('-').slice(-1);
  const contextPromise = fetch(`${process.env.PUBLIC_URL}/posts/${postId}`)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.json().then((postData) => Promise.resolve({ postData: postData || {} }));
      } else {
        return readStringStream(res.body)
          .then((msg) => {
            return { postData: {}, error: { message: msg || res.statusText } };
          }, (err) => {
            return { postData: {}, error: { message: res.statusText } };
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return { postData: {}, error: { message: err.message } };
    });
  renderPageHandler(contextPromise, req, res, next);
});
app.get('*', (req, res, next) => {
  renderPageHandler(Promise.resolve({}), req, res, next);
});

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

export default app;
