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
          return { error: 500, src: error };
        }
      }
    }
    return { error: 500 };
  } else {
    return { error: 400 };
  }
}
export default PostsService;