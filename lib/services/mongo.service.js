const ContainerKeys = require('./container-keys');
const BaseConsumer = require('../consumer');
const MongoClient = require('mongodb').MongoClient;

const MongoService = Object.create(BaseConsumer);
MongoService.name = 'MongoService';
MongoService.dependencyKeys = MongoService.dependencyKeys.concat([ContainerKeys.SERVICE_CONFIG]);
MongoService.client = MongoClient;
MongoService._connectedClient = undefined;
MongoService.getConnectedClient = async function() {
  if (!this._connectedClient && this.serviceConfig) {
    console.log('Connecting to MongoDB...');
    try {
      this._connectedClient = await this.client.connect(this.serviceConfig.url, { useNewUrlParser: true });
      console.log(`Connected to ${this.serviceConfig.url}!`);
    } catch (error) {
      console.log('Failed to connect.')
      console.log(error);
    }
  }
  return this._connectedClient;
}
module.exports = MongoService;