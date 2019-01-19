var MOCK_BLOG_POSTS = require('../mock/data');
var BaseConsumer = require('../consumer');
var PostsService = Object.create(BaseConsumer);
PostsService.getPost = function(postId) {
  if (postId) {
      // TODO: lookup with mongoDB
      if (MOCK_BLOG_POSTS[postId]) {
          return MOCK_BLOG_POSTS[postId];
      } else {
          return { error: 404 };
      }
  } else {
      return { error: 400 };
  }
}
module.exports = PostsService;