'use strict';

const libExt = require('library-extensions');

module.exports = libExt.create('takeWhileInclusive', (obs, condition) =>
  obs.publish(
    result => result.takeWhile(condition)
      .merge(result.skipWhile(condition).take(1))
  ));
