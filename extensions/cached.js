'use strict';

const Rx = require('rx');
const libExt = require('library-extensions');

const currentTime = () => new Date().getTime();
module.exports = libExt.create('cached', (obs, time) => {
  const memory = new Rx.BehaviorSubject({time: Number.NEGATIVE_INFINITY});
  const operationWithSave = obs
    .map(v => ({time: currentTime(), value: v}))
    .doOnNext(v => memory.onNext(v));
  return Rx.Observable.concat(memory.take(1), operationWithSave)
    .first(r => r.time > currentTime() - time)
    .map(r => r.value);
});

