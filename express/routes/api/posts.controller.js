const express = require('express');
const createError = require('http-errors');

const ContainerKeys = require('../../../lib/services/container-keys');
const BaseConsumer = require('../../../lib/consumer');

const PostsController = Object.create(BaseConsumer);
PostsController.name = 'PostsController';
PostsController.dependencyKeys = PostsController.dependencyKeys.concat([ContainerKeys.POSTS_SERVICE]);
PostsController.getRouter = function() {
  const router = express.Router();
  /* GET post. */
  const postIdHandler = function(req, res, next) {
    let postId = req.params.postId;
    if (this.postsService) {
      this.postsService.getPost(postId)
        .then((result) => {
          if (result) {
            if (!result.error) {
              res.send(result);
            } else {
              next(createError(result.error));
            }
          } else {
            next(createError(400, new Error('Could not find the post.')))
          }
        })
        .catch((err) => next(createError(err.status || 500, err)));
    } else {
      console.log('No service');
      next(createError(500, 'Could not retrieve the post.'));
    }
  };

  const postMetaHandler = function(req, res, next) {
    if (this.postsService) {
      const _pageSize = parseInt(req.query.limit, 10) || 15;
      const _page = parseInt(req.query.page, 10) || 0;
      const _tags = req.query.tags ? req.query.tags.split(' ') : [];
      this.postsService.getPostsMeta(_page, _pageSize, _tags)
        .then((result) => {
          if (result) {
            if (!result.error) {
              res.send(result);
            } else {
              next(createError(result.error));
            }
          } else {
            next(createError(400, new Error('Could not find the metadata for posts.')))
          }
        })
        .catch((err) => next(createError(err.status || 500, err)));
    } else {
      console.log('No service');
      next(createError(500, 'Could not retrieve the metadata for posts.'));
    }
  };

  router.get('/meta', postMetaHandler.bind(this));
  //router.get('/:postId', postIdHandler.bind(this));
  return router;
}
module.exports = PostsController;