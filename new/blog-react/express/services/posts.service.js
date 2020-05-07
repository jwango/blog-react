const BaseConsumer = require('../consumer');
const PostsService = Object.create(BaseConsumer);

process.env.MONGODB_DB = process.env.MONGODB_DB || 'blog-react';

function getCollection(client) {
  return client.db(process.env.MONGO_DB).collection("posts");
}

async function read(client, postId) {
  const postsCollection = getCollection(client);
  return await postsCollection.findOne({ "_id": postId });
}

function readPostsMeta(client, page, pageSize, tags) {
  const postsCollection = getCollection(client);
  const query = (tags && tags.length) ? { tags: { $in: tags } } : {};
  const cursor = postsCollection.find(query)
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

PostsService.name = "PostsService";
PostsService.dependencyKeys = PostsService.dependencyKeys.concat(['mongoService']);
PostsService.getPost = async function(postId) {
  if (postId) {
    return useMongo(this.mongoService, read, postId);
  } else {
    return { status: 400, error: new Error('Invalid post.') };
  }
};
PostsService.getPostsMeta = async function(page, pageSize, tags) {
  const _pageSize = parseInt(pageSize, 10) || 15;
  const _page = parseInt(page, 10) || 0;
  const _tags = tags || [];
  return useMongo(this.mongoService, readPostsMeta, _page, _pageSize, _tags);  
};
module.exports = PostsService;