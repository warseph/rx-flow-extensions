'use strict';

const libExt = require('library-extensions');

module.exports = libExt.create('takeWhileInclusive', (obs, condition, amount) =>
  obs.publish(
    result => result.takeWhile(condition)
      .merge(result.skipWhile(condition).take(amount || 1))
  ));
