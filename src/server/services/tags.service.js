import BaseConsumer from '../consumer';
var TagsService = Object.create(BaseConsumer);

function getCollection(client) {
  return client.db("andful").collection("posts");
}

function aggregateTags(client) {
  var postsCollection = getCollection(client);
  var cursor = postsCollection.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: null, tagSet: { $addToSet: "$tags" } } },
    { $unwind: "$tagSet" },
    { $project: { _id: "$tagSet" } }
  ]).sort({ _id: 1 });
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

TagsService.name = "TagsService";
TagsService.dependencyKeys = TagsService.dependencyKeys.concat(['mongoService']);
TagsService.getTags = async function() {
  return useMongo(this.mongoService, aggregateTags);
};
export default TagsService;