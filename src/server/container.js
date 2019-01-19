var Container = {
  factoryMap: {},
  singletonMap: {},
  lookup: async function(key) {
    var singletonMeta = this.singletonMap[key];
    if (singletonMeta) {
      if (singletonMeta.init) {
        return singletonMeta.instance;
      }
    }
    if (this.factoryMap[key]) {
      var consumer = await this.factoryMap[key](this);
      if (singletonMeta) {
        singletonMeta.instance = consumer;
        singletonMeta.init = true;
      }
      return consumer;
    }
    return undefined;
  },
  register: function(key, isSingleton, factory) {
    this.factoryMap[key] = factory;
    if (isSingleton) {
      this.singletonMap[key] = {
        init: false,
        instance: undefined
      };
    }
  }
};
export default Container;