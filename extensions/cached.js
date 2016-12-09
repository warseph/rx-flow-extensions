'use strict';

const Rx = require('rx');
const libExt = require('library-extensions');

module.exports = libExt.create('cached', (obs, time) => {
  let cache;
  const invalidate = () => { cache = undefined; };
  return Rx.Observable.create(observer => {
    if (cache === undefined) {
      cache = obs.doOnError(invalidate).shareReplay();
      if (time > 0) {
        setTimeout(invalidate, time);
      }
    }
    observer.onNext(cache);
    observer.onCompleted();
  }).flatMap(x => x);
});
