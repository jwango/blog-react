const Container = require('../container');
const MongoService = require('../services/mongo.service');
const PostsServiceMock = require('../services/posts.service.mock');
const PostsService = require('../services/posts.service');
const TagsService = require('../services/tags.service');

const ContainerKeys = require('./container-keys');

function register() {
  console.log('initializing container');
  // Initialize Container
  const container = Object.create(Container);
  container.register(ContainerKeys.SERVICE_CONFIG, true, async function(container) {
    return {
      url: process.env.MONGODB_URI
    };
  });
  container.register(ContainerKeys.MONGO_SERVICE, true, async function(container) {
    const instance = Object.create(MongoService);
    await instance.init(container);
    await instance.getConnectedClient();
    console.log(ContainerKeys.MONGO_SERVICE + "ready");
    return instance;
  });
  container.register(ContainerKeys.POSTS_SERVICE, true, async function(container) {
    const instance = Object.create(PostsService);
    await instance.init(container);
    return instance;
  });
  container.register(ContainerKeys.TAGS_SERVICE, true, async function(container) {
    const instance = Object.create(TagsService);
    await instance.init(container);
    return instance;
  });
  return container;
}

module.exports = register();