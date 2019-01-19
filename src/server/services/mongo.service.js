import BaseConsumer from '../consumer';
var MongoClient = require('mongodb').MongoClient;
var MongoService = Object.create(BaseConsumer);
MongoService.dependencyKeys = MongoService.dependencyKeys.concat(['serviceConfig']);
MongoService.client = MongoClient;
MongoService.connectedClient = undefined;
export default MongoService;