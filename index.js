'use strict';

const libExt = require('library-extensions');

module.exports = libExt.bundle([
  /* eslint global-require: 0 */
  require('./extensions/just')
]);
