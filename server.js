/**
 * Module dependencies.
 */
const next = require('next');
const express = require('express');

const expressApp = require('./express/app');

/**
 * Get port from environment and store in Express.
 */

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const router = express.Router();
  router.all('*', (req, res) => {
    return handle(req, res)
  });

  const server = expressApp(router);
  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  });
});