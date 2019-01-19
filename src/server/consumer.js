var BaseConsumer = {
  container: undefined,
  dependencyKeys: [],
  init: function(container) {
    this.container = container;
    this.rebind();
  },
  rebind: function() {
    this.dependencyKeys.forEach((dependencyKey) => {
      this[dependencyKey] = this.container.lookup(dependencyKey);
    });
  }
};
module.exports = BaseConsumer;