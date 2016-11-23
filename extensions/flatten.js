'use strict';

const libExt = require('library-extensions');

module.exports = libExt.create('flatten', obs => obs.flatMap(x => x));
