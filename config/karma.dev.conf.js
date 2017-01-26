const base = require('./karma.conf.js');

module.exports = function(config) {
  base(config);
  config.set({
    files: base.deps
      .concat(base.entries)
      .concat(base.helpers)
      .concat(base.units)
      // .concat(base.integrations)
    ,
    singleRun: false,
    autoWatch: true,
  });
};
