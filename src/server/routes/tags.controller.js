import BaseConsumer from '../consumer';
var express = require('express');
var createError = require('http-errors');
var TagsController = Object.create(BaseConsumer);

TagsController.dependencyKeys = TagsController.dependencyKeys.concat(['tagsService']);
TagsController.getRouter = function() {
  var router = express.Router();
  /* GET post. */
  var tagsHandler = function(req, res, next) {
    if (this.tagsService) {
      this.tagsService.getTags()
        .then((result) => {
          if (result) {
            if (!result.error) {
              res.send(result);
            } else {
              next(createError(result.error));
            }
          } else {
            next(createError(400, new Error('Could not find the tags.')))
          }
        })
        .catch((err) => next(createError(err.status || 500, err)));
    } else {
      console.log('No service');
      next(createError(500, 'Could not retrieve the tags.'));
    }
  };

  router.get('/', tagsHandler.bind(this));
  return router;
}
export default TagsController;