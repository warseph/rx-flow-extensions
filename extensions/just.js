'use strict';

const libExt = require('library-extensions');

module.exports = libExt.create('just', (obs, value) => obs.map(() => value));
