const MOCK_BLOG_POSTS = require('../../posts/data');
const BaseConsumer = require('../consumer');
const PostsService = Object.create(BaseConsumer);
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
    const _pageSize = parseInt(pageSize, 10) || 15;
    const _page = parseInt(page, 10) || 0;
    const _start = _pageSize * _page;
    const _keys = Object.keys(MOCK_BLOG_POSTS).slice(_start, _start + pageSize);
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
module.exports = PostsService;