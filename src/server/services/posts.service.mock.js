var MOCK_BLOG_POSTS = require('../mock/data');
import BaseConsumer from '../consumer';
var PostsService = Object.create(BaseConsumer);
PostsService.getPost = async function(postId) {
  if (postId) {
      if (MOCK_BLOG_POSTS[postId]) {
          return MOCK_BLOG_POSTS[postId];
      } else {
          return { error: 404 };
      }
  } else {
      return { error: 400 };
  }
}
export default PostsService;