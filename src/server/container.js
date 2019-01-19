var Container = {
  factoryMap: {},
  lookup: function(key) {
    var consumer = this.factoryMap[key]();
    if (consumer) {
      consumer.init(this);
      return consumer;
    }
    return undefined;
  },
  register: function(key, factory) {
    this.factoryMap[key] = factory;
  }
};
module.exports = Container;