var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var assetsMap = require('../../build/public/asset-manifest.json');

import postsRouter from './routes/posts';

import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { App } from '../client/scenes/app/app.scene';
import React from 'react';
import fetch from 'isomorphic-fetch';
import serialize from 'serialize-javascript';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('build/public'));

// enable CORS for my app
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

      const depScript = depKey ? `<script src="/${assetsMap[depKey]}" defer></script>` : '';
      res.send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <link rel="manifest" href="/manifest.json">
            <link rel="shortcut icon" href="/favicon.ico">
            <title>Second Ave</title>
            <link href="/${assetsMap["main.css"]}" rel="stylesheet">
            <script>window.__INITIAL_DATA__ = ${serialize(context)}</script>
          </head>
          <body id="root">
            <noscript>You need to enable JavaScript to run this app.</noscript>
            ${markup}
            ${depScript}
            <script src="/${assetsMap["runtime~main.js"]}" defer></script>
            <script src="/${assetsMap["main.js"]}" defer></script>
          </body>
        </html>
        `);
    })
    .catch((error) => {
      console.log(error);
      next(createError(500))
    });
}

//app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.get('/blog/posts/:postName', (req, res, next) => {
  const postId = req.params.postName.split('-').slice(-1);
  const contextPromise = fetch(`http://localhost:3001/posts/${postId}`)
    .then((res) => res.json())
    .then((postData) => Promise.resolve({ postData: postData }))
    .catch((err) => Promise.resolve({ postData: {} }));
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

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;
