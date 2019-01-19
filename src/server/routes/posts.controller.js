import BaseConsumer from '../consumer';
var express = require('express');
var createError = require('http-errors');
var PostsController = Object.create(BaseConsumer);

PostsController.dependencyKeys = PostsController.dependencyKeys.concat(['postsService']);
PostsController.getRouter = function() {
  var router = express.Router();
  /* GET post. */
  var postIdHandler = function(req, res, next) {
    let postId = req.params.postId;
    if (this.postsService) {
      this.postsService.getPost(postId)
        .then((result) => {
          if (!result.error) {
            res.send(result);
          } else {
            next(createError(result.error));
          }
        })
        .catch((err) => next(createError(err)));
    } else {
      next(createError(500));
    }
  };
  router.get('/:postId', postIdHandler.bind(this));
  return router;
}
export default PostsController;