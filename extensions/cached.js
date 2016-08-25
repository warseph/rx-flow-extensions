'use strict';

const Rx = require('rx');
const libExt = require('library-extensions');

const currentTime = () => new Date().getTime();
const cache = function* (time, operation) {
  /* eslint no-constant-condition: 0 */
  const cacheForever = (time === undefined || time === null);
  while (true) {
    const expires = currentTime() + time;
    const value = operation();
    yield value;
    while (cacheForever || expires > currentTime()) {
      yield value.catch(() => operation());
    }
  }
};

module.exports = libExt.create('cached', (obs, time) => {
  const createCache = () => {
    const replay = new Rx.ReplaySubject();
    obs.subscribe(replay);
    return replay;
  };
  return Rx.Observable.from(cache(time, createCache)).take(1).flatMap(x => x);
});

