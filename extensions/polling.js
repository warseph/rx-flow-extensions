'use strict';

const Rx = require('rx');
const libExt = require('library-extensions');

module.exports = libExt.create('polling', (obs, interval, maxAttempts) =>
  Rx.Observable.just(0)
    .merge(Rx.Observable.interval(interval))
    .flatMapFirst(() => obs)
    .take(maxAttempts)
  );
