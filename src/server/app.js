var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var assetsMap = require('../../build/public/asset-manifest.json');

import indexRouter from './routes/index';
import postsRouter from './routes/posts';

import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { App } from '../client/scenes/app/app.scene';
import React from 'react';

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

//app.use('/', indexRouter);
//app.use('/posts', postsRouter);
app.get('*', (req, res, next) => {
  const markup = renderToString(
    <StaticRouter location={req.url} context={{}}>
      <App />
    </StaticRouter>
  )

  const depScript = depKey ? `<script src="./${assetsMap[depKey]}" defer></script>` : '';
  // TODO: might be missing another script (the hashed one)
  res.send(`
  <!doctype html>
  <html lang="en">
    <head>
      <base href=".">
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <link rel="manifest" href="./manifest.json">
      <link rel="shortcut icon" href="./favicon.ico">
      <title>Meshi</title>
      <link href="./${assetsMap["main.css"]}" rel="stylesheet">
    </head>
    <body id="root">
      <noscript>You need to enable JavaScript to run this app.</noscript>
      ${markup}
      ${depScript}
      <script src="./${assetsMap["runtime~main.js"]}" defer></script>
      <script src="./${assetsMap["main.js"]}" defer></script>
    </body>
  </html>
  `);
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
