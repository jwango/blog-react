import BaseConsumer from '../consumer';
var express = require('express');
var createError = require('http-errors');
var CommentsController = Object.create(BaseConsumer);

CommentsController.dependencyKeys = CommentsController.dependencyKeys.concat(['commentsService']);
CommentsController.getRouter = function() {
  var router = express.Router();
  /* GET post. */
  var commentIdHandler = function(req, res, next) {
    let commentId = req.params.commentId;
    if (this.commentsService) {
      this.commentsService.getComment(commentId)
        .then((result) => {
          if (result) {
            if (!result.error) {
              res.send(result);
            } else {
              next(createError(result.error));
            }
          } else {
            next(createError(400, new Error('Could not find the comment.')))
          }
        })
        .catch((err) => next(createError(err.status || 500, err)));
    } else {
      console.log('No service');
      next(createError(500, 'Could not retrieve the comment.'));
    }
  };

  var commentPostHandler = function(req, res, next) {
    if (this.commentsService) {
      this.commentsService.postComment(req.body.postId, req.body.user, req.body.body)
        .then((result) => {
          if (result != null) {
            if (!result.error) {
              res.send({ commentId: result });
            } else {
              next(createError(result.error));
            }
          } else {
            next(createError(400, new Error('Could not create the comment.')))
          }
        })
        .catch((err) => next(createError(err.status || 500, err)));
    } else {
      console.log('No service');
      next(createError(500, 'Could not post the comment.'));
    }
  }

  var commentReplyHandler = function(req, res, next) {
    if (this.commentsService) {
      this.commentsService.postReply(req.params.commentId, req.body.user, req.body.body)
        .then((result) => {
          if (result != null) {
            if (!result.error) {
              res.send({ commentId: result });
            } else {
              next(createError(result.error));
            }
          } else {
            next(createError(400, new Error('Could not create the comment.')))
          }
        })
        .catch((err) => next(createError(err.status || 500, err)));
    } else {
      console.log('No service');
      next(createError(500, 'Could not post the comment.'));
    }
  }

  router.post('/:commentId/replies', commentReplyHandler.bind(this));
  router.get('/:commentId', commentIdHandler.bind(this));
  router.post('/', commentPostHandler.bind(this));
  return router;
}
export default CommentsController;