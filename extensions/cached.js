'use strict';

const Rx = require('rxjs/Rx');
const libExt = require('library-extensions');

module.exports = libExt.create('cached', (obs, time) => {
  let cache;
  const invalidate = () => { cache = undefined; };
  return Rx.Observable.create(observer => {
    if (cache === undefined) {
      cache = obs.do(null, invalidate).shareReplay();
      if (time > 0) {
        setTimeout(invalidate, time);
      }
    }
    observer.next(cache);
    observer.complete();
  }).flatMap(x => x);
});
