'use strict';

const libExt = require('library-extensions');

module.exports = libExt.create('matching', (obs, obs2, groupBy, condition) =>
  obs.groupBy(groupBy)
    .flatMap(groups => groups.combineLatest(obs2.find(
      value => condition(groups.key, value)))));
