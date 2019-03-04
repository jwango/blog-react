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
      if (singletonMeta) {
        singletonMeta.instance = this.factoryMap[key](this);
        singletonMeta.init = true;
        return singletonMeta.instance;
      }
      return this.factoryMap[key](this);
    }
    return undefined;
  },
  register: function(key, isSingleton, asyncFactory) {
    this.factoryMap[key] = asyncFactory;
    if (isSingleton) {
      this.singletonMap[key] = {
        init: false,
        instance: undefined
      };
    }
  }
};
export default Container;