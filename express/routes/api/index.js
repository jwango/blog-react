const express = require('express');

const PostsController = require('./posts.controller');
const TagsController = require('./tags.controller');

const apiRouter = function(container) {
  const router = express.Router();

  const postsController = Object.create(PostsController);
  postsController.init(container);
  router.use('/posts', postsController.getRouter());

  const tagsController = Object.create(TagsController);
  tagsController.init(container);
  router.use('/tags', tagsController.getRouter());
  
  return router;
}


module.exports = apiRouter;