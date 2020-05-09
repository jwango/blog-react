const BaseConsumer = {
  name: 'BaseConsumer',
  container: undefined,
  dependencyKeys: [],
  init: async function(container) {
    this.container = container;
    await this.rebind();
  },
  rebind: async function() {
    for (let i = 0; i < this.dependencyKeys.length; i++) {
      const dependencyKey = this.dependencyKeys[i];
      this[dependencyKey] = await this.container.lookup(dependencyKey);
    }
    console.log('completed binding for ' + this.name);
  }
};
module.exports = BaseConsumer;