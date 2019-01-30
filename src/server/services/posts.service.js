import BaseConsumer from '../consumer';
var PostsService = Object.create(BaseConsumer);

function getCollection(client) {
  return client.db("test").collection("foo");
}

async function read(client, postId) {
  var foo = getCollection(client);
  return await foo.findOne({ "_id": postId });
}

function readPostsMeta(client, page, pageSize) {
  var foo = getCollection(client);
  var cursor = foo.find()
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
PostsService.getPostsMeta = async function(page, pageSize) {
  var _pageSize = parseInt(pageSize, 10) || 15;
  var _page = parseInt(page, 10) || 0;
  return useMongo(this.mongoService, readPostsMeta, _page, _pageSize);  
};
export default PostsService;