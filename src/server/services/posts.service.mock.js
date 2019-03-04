var MOCK_BLOG_POSTS = require('../mock/data');
import BaseConsumer from '../consumer';
var PostsService = Object.create(BaseConsumer);
PostsService.name = "PostsServiceMock";
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
PostsService.getPostsMeta = async function(page, pageSize, tags) {
    var _pageSize = parseInt(pageSize, 10) || 15;
    var _page = parseInt(page, 10) || 0;
    var _start = _pageSize * _page;
    var _keys = Object.keys(MOCK_BLOG_POSTS).slice(_start, _start + pageSize);
    return _keys.map((_key) => {
        var post = MOCK_BLOG_POSTS[_key];
        return {
            id: post.guid,
            title: post.title,
            description: post.description,
            pubDate: '',
            link: `/posts/${post.guid}`
        };
    });
}
export default PostsService;