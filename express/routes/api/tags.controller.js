const express = require('express');
const createError = require('http-errors');

const ContainerKeys = require('../../../lib/services/container-keys');
const BaseConsumer = require('../../../lib/consumer');

const TagsController = Object.create(BaseConsumer);
TagsController.name = 'TagsController';
TagsController.dependencyKeys = TagsController.dependencyKeys.concat([ContainerKeys.TAGS_SERVICE]);
TagsController.getRouter = function() {
  const router = express.Router();
  /* GET post. */
  const tagsHandler = function(req, res, next) {
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
module.exports = TagsController;