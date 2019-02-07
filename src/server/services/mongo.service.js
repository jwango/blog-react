import BaseConsumer from '../consumer';
var MongoClient = require('mongodb').MongoClient;
var MongoService = Object.create(BaseConsumer);
MongoService.dependencyKeys = MongoService.dependencyKeys.concat(['serviceConfig']);
MongoService.client = MongoClient;
MongoService._connectedClient = undefined;
MongoService.getConnectedClient = async function() {
  if (!this._connectedClient && this.serviceConfig) {
    console.log("Connecting to MongoDB...");
    try {
      this._connectedClient = await this.client.connect(this.serviceConfig.url, { useNewUrlParser: true });
      console.log(`Connected to ${this.serviceConfig.url}!`);
    } catch (error) {
      console.log("Failed to connect.")
      console.log(error);
    }
  }
  return this._connectedClient;
}
export default MongoService;