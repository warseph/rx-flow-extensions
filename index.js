'use strict';

const libExt = require('library-extensions');

module.exports = libExt.bundle([
  /* eslint global-require: 0 */
  require('./extensions/cached'),
  require('./extensions/just'),
  require('./extensions/matching'),
  require('./extensions/polling'),
  require('./extensions/take-while-inclusive')
]);
