import BaseConsumer from '../consumer';
var PostsService = Object.create(BaseConsumer);

async function read(client, postId) {
    var foo = client.db("test").collection("foo");
    return await foo.findOne({ "_id": postId });
}

PostsService.dependencyKeys = PostsService.dependencyKeys.concat(['mongoService']);
PostsService.getPost = async function(postId) {
  if (postId) {
    if (this.mongoService) {
      const client = await this.mongoService.getConnectedClient();
      if (client) {
        try {
          return await read(client, postId);
        } catch (error) {
          return { error: error, status: 500 };
        }
      }
    }
    return { status: 500, error: new Error('Could not bind to service and fetch the post.') };
  } else {
    return { status: 400, error: new Error('Invalid post.') };
  }
}
export default PostsService;