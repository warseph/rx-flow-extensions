'use strict';

const Rx = require('rx');
const libExt = require('library-extensions');

const currentTime = () => new Date().getTime();
const cache = function* (time, operation) {
  /* eslint no-constant-condition: 0 */
  while (true) {
    const cachedAt = currentTime();
    const value = operation();
    do {
      yield value;
    } while (time + cachedAt > currentTime());
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

