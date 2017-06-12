'use strict';

const Rx = require('rxjs/Rx');
const libExt = require('library-extensions');

module.exports = libExt.create('polling', (obs, interval, maxAttempts) =>
  Rx.Observable.of(0)
    .merge(Rx.Observable.interval(interval))
    .exhaustMap(() => obs)
    .take(maxAttempts)
);
