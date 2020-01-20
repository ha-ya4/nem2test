const { override } = require('customize-cra')

module.exports = function override(config, env) {
  config['externals'] = ['/node_modules/', "bufferutil", "utf-8-validate"]
  return config;
}