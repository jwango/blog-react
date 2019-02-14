import BaseConsumer from '../consumer';
var PostsService = Object.create(BaseConsumer);

function getCollection(client) {
  return client.db("andful").collection("posts");
}

async function read(client, postId) {
  var postsCollection = getCollection(client);
  return await postsCollection.findOne({ "_id": postId });
}

function readPostsMeta(client, page, pageSize, tags) {
  var postsCollection = getCollection(client);
  var query = (tags && tags.length) ? { tags: { $in: tags } } : {};
  var cursor = postsCollection.find(query)
    .sort({ lastUpdateDate: -1 })
    .skip(pageSize * page)
    .limit(pageSize)
    .map((doc) => {
      return {
        id: doc.guid,
        title: doc.title,
        description: doc.description,
        pubDate: doc.lastUpdateDate,
        link: `/posts/${doc.guid}`
      };
    });
  return new Promise((resolve, reject) => {
    cursor.toArray((err, arr) => {
      if (err) {
        reject(err);
      } else {
        resolve(arr);
      }
    });
  });
}

async function useMongo(service, asyncFunc, ...args) {
  if (service) {
      const client = await service.getConnectedClient();
      if (client) {
        try {
          return await asyncFunc(client, ...args);
        } catch (error) {
          return { error: error, status: 500 };
        }
      }
    }
    return { status: 500, error: new Error('Could not bind to service and fetch the post.') };
}

PostsService.dependencyKeys = PostsService.dependencyKeys.concat(['mongoService']);
PostsService.getPost = async function(postId) {
  if (postId) {
    return useMongo(this.mongoService, read, postId);
  } else {
    return { status: 400, error: new Error('Invalid post.') };
  }
};
PostsService.getPostsMeta = async function(page, pageSize, tags) {
  var _pageSize = parseInt(pageSize, 10) || 15;
  var _page = parseInt(page, 10) || 0;
  var _tags = tags || [];
  return useMongo(this.mongoService, readPostsMeta, _page, _pageSize, _tags);  
};
export default PostsService;